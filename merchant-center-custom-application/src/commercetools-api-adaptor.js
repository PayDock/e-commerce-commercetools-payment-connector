import { CHARGE_STATUSES } from './constants';
import PaydockApiAdaptor from './paydock-api-adaptor';
import {decrypt, encrypt} from "./helpers";

class CommerceToolsAPIAdapter {
    constructor(env) {
        this.env = env;
        this.projectKey = env.projectKey;
        this.region = env.region;
        this.arrayPaydockStatus = CHARGE_STATUSES;
        this.proxyUrl = '/proxy/commercetools';
    }

    async makeRequest(endpoint, method = 'GET', body = null) {
        try {
            const apiUrl = `${this.proxyUrl}${endpoint}`;
            const response = await fetch(apiUrl, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: body ? JSON.stringify(body) : null,
            });

            if (!response.ok) {
                const error = new Error(`HTTP error! Status: ${response.status}`);
                error.status = response.status;
                throw error;
            }

            return await response.json();
        } catch (error) {
            throw error;
        }
    }

    async setConfigs(group, data) {
        let requestData = {
            id: data.id ?? crypto.randomUUID(),
            version: data.version ?? 0,
            createdAt: data.createdAt ?? new Date().toISOString(),
            lastModifiedAt: new Date().toISOString(),
            container: 'paydockConfigContainer',
            key: group ?? 'empty',
            value: data.value ?? null,
        };
        const notificationUrl = await this.getNotificationUrl();
        this.updateAPINotification(group, data.value, notificationUrl);

        if (requestData.value.credentials_access_key) {
            requestData.value.credentials_access_key = await encrypt(requestData.value.credentials_access_key, this.clientSecret);
        }
        if (requestData.value.credentials_public_key) {
            requestData.value.credentials_public_key = await encrypt(requestData.value.credentials_public_key, this.clientSecret);
        }
        if (requestData.value.credentials_secret_key) {
            requestData.value.credentials_secret_key = await encrypt(requestData.value.credentials_secret_key, this.clientSecret);
        }
        await this.makeRequest('/custom-objects', 'POST', requestData)

        data = await this.getConfigs(group);

        return data;
    }

    updateAPINotification(group, data, notificationUrl) {
        const isToken = 'access_key' === data.credentials_type;
        const isLive = group === 'live';
        let secretKey = isToken ? data.credentials_access_key : data.credentials_secret_key;
        if (secretKey && notificationUrl) {
            const paydockApiAdaptor = new PaydockApiAdaptor(isLive, isToken, secretKey, notificationUrl);
            paydockApiAdaptor.registerNotifications().catch(error => {
                throw error.response.data.error;
            });
        }
    }

    async getNotificationUrl() {
        let objectNotificationUrl = await this.makeRequest('/custom-objects/paydock-notification', 'GET');
        if (objectNotificationUrl.results.length) {
            return objectNotificationUrl.results[0].value;
        }
        return null;
    }

    async getConfigs(group) {
        let data = await this.makeRequest(`/custom-objects/paydockConfigContainer/${group}`);

        if (data.value.credentials_access_key) {
            data.value.credentials_access_key = await decrypt(data.value.credentials_access_key, this.clientSecret);
        }
        if (data.value.credentials_public_key) {
            data.value.credentials_public_key = await decrypt(data.value.credentials_public_key, this.clientSecret);
        }
        if (data.value.credentials_secret_key) {
            data.value.credentials_secret_key = await decrypt(data.value.credentials_secret_key, this.clientSecret);
        }

        return data
    }

    async getLogs() {
        let logs = [];
        let paydockLogs = await this.makeRequest('/payments/?&sort=createdAt+desc&limit=500');
        if (paydockLogs.results) {
            paydockLogs.results.forEach((paydockLog) => {
                paydockLog.interfaceInteractions.forEach((interactionLog) => {
                    let message = typeof interactionLog.fields.message === 'string' ? interactionLog.fields.message : null;
                    logs.push({
                        operation_id: interactionLog.fields.chargeId,
                        date: interactionLog.fields.createdAt,
                        operation: this.getStatusByKey(interactionLog.fields.operation),
                        status: interactionLog.fields.status,
                        message: message,
                    });
                });
            });
        }

        return logs.sort((first, second) => {
            const date1 = Date.parse(first.date);
            const date2 = Date.parse(second.date);
            return date2 - date1;
        });
    }

    getStatusByKey(statusKey) {
        return this.arrayPaydockStatus[statusKey] ?? statusKey;
    }

    collectArrayPayments(payments, paymentsArray) {
        if (!payments.results) return;

        payments.results.forEach((payment) => {
            if (!payment.custom.fields.AdditionalInformation) {
                return;
            }
            let customFields = payment.custom.fields;
            let additionalFields = JSON.parse(customFields.AdditionalInformation);
            let billingInformation = this.convertInfoToString(additionalFields.BillingInformation ?? '-');
            let shippingInformation = this.convertInfoToString(additionalFields.ShippingInformation ?? '-');
            shippingInformation = billingInformation === shippingInformation ? '-' : shippingInformation;

            let amount = payment.amountPlanned.centAmount / (10 ** payment.amountPlanned.fractionDigits);

            paymentsArray[payment.id] = {
                id: payment.id,
                amount,
                currency: payment.amountPlanned.currencyCode,
                createdAt: payment.createdAt,
                lastModifiedAt: payment.lastModifiedAt,
                paymentSourceType: customFields.PaydockPaymentType,
                paydockPaymentStatus: customFields.PaydockPaymentStatus,
                paydockChargeId: customFields.PaydockTransactionId,
                shippingInfo: shippingInformation,
                billingInfo: billingInformation,
                refundAmount: customFields.RefundedAmount ?? 0,
                capturedAmount: customFields.CapturedAmount ?? 0,
            };
        });
    }

    convertInfoToString(info) {
        if (typeof info !== 'object') {
            return '-';
        }
        const name = info.name ?? '-';
        const address = info.address ?? '-';
        return `Name: ${name} \nAddress: ${address}`;
    }

    async getOrders() {
        try {
            const paydockOrders = [];
            const paymentsArray = [];
            const payments = await this.makeRequest(
                '/payments?where=' +
                encodeURIComponent('paymentMethodInfo(method="paydock-pay") and custom(fields(AdditionalInformation is not empty))') +
                '&sort=createdAt+desc&limit=500'
            );
            this.collectArrayPayments(payments, paymentsArray);

            if (paymentsArray) {
                const orderQuery = '"' + Object.keys(paymentsArray).join('","') + '"';
                const orders = await this.makeRequest(
                    '/orders?where=' + encodeURIComponent(`paymentInfo(payments(id in(${orderQuery})))`) + '&sort=createdAt+desc&limit=500'
                );
                await this.collectArrayOrders(orders, paymentsArray, paydockOrders);
            }
            return paydockOrders;
        } catch (error) {
            throw error;
        }
    }

    async updateOrderStatus(data) {
        const orderId = data.orderId;
        let response = {};
        let error = null;

        try {
            const payment = await this.makeRequest(`/payments/${orderId}`);
            if (payment) {
                const requestData = {
                    version: payment.version,
                    actions: [
                        {
                            action: 'setCustomField',
                            name: 'PaymentExtensionRequest',
                            value: JSON.stringify({
                                action: 'updatePaymentStatus',
                                request: data,
                            }),
                        },
                    ],
                };

                const updateStatusResponse = await this.makeRequest(`/payments/${orderId}`, 'POST', requestData);
                const paymentExtensionResponse = updateStatusResponse.custom?.fields?.PaymentExtensionResponse;
                if (!paymentExtensionResponse || !paymentExtensionResponse.status) {
                    error = paymentExtensionResponse ? paymentExtensionResponse.message : 'Error updating status of payment';
                }
            } else {
                error = 'Error fetching payment';
            }
        } catch (err) {
            return { success: false, message: 'Error updating status of payment' };
        }

        response = error ? { success: false, message: error } : { success: true };
        return response;
    }

    async collectArrayOrders(orders, paymentsArray, paydockOrders) {
        for (const order of orders.results) {
            let objOrder = {
                id: order.id,
                order_number: order.orderNumber,
                order_payment_status: order.paymentState,
                order_url: `https://mc.${this.region}.commercetools.com/${this.projectKey}/orders/${order.id}`,
            };

            if (order.paymentInfo.payments) {
                this.collectArrayOrdersPayments(order.paymentInfo.payments, paymentsArray, objOrder);
            }
            paydockOrders.push(objOrder);
        }
    }

    collectArrayOrdersPayments(orderPayments, paymentsArray, objOrder) {
        for (const payment of orderPayments) {
            const currentPayment = paymentsArray[payment.id];
            if (currentPayment !== undefined) {
                objOrder.amount = currentPayment.amount;
                objOrder.currency = currentPayment.currency;
                objOrder.created_at = currentPayment.createdAt;
                objOrder.updated_at = currentPayment.lastModifiedAt;
                objOrder.payment_source_type = currentPayment.paymentSourceType;
                objOrder.status = currentPayment.paydockPaymentStatus;
                objOrder.statusName = this.getStatusByKey(currentPayment.paydockPaymentStatus);
                objOrder.paydock_transaction = currentPayment.paydockChargeId;
                objOrder.shipping_information = currentPayment.shippingInfo;
                objOrder.billing_information = currentPayment.billingInfo;
                objOrder.captured_amount = currentPayment.capturedAmount;
                objOrder.refund_amount = currentPayment.refundAmount;
                objOrder.possible_amount_captured = currentPayment.amount - currentPayment.capturedAmount;
            }
        }
    }
}

export default CommerceToolsAPIAdapter;
