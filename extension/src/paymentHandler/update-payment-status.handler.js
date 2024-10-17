import {
    createSetCustomFieldAction
} from './payment-utils.js'
import c from '../config/constants.js'
import {updatePaydockStatus} from "../service/web-component-service.js";
import config from "../config/config.js";

async function execute(paymentObject, loggerContext) {
    const paymentExtensionRequest = JSON.parse(
        paymentObject.custom.fields.PaymentExtensionRequest
    )
    const orderNumber = paymentObject.id;
    const actions = []
    const requestBodyJson = paymentExtensionRequest.request;
    let errorMessage
    let chargeId = paymentObject.custom.fields.PaydockTransactionId;
    const oldStatus = paymentObject.custom.fields.PaydockPaymentStatus;

    const {
        newStatus,
        paymentStatus,
        responseAPI,
        orderStatus,
        error,
        refundedAmount
    } = await processPaymentStatusChange(paymentObject, requestBodyJson);


    if (error) {
        actions.push(createSetCustomFieldAction(c.CTP_INTERACTION_PAYMENT_EXTENSION_RESPONSE, {
            status: false,
            message: error
        }));
        loggerContext.addPaydockLog({
            paydockChargeID: chargeId,
            operation: newStatus,
            status: newStatus,
            message: error
        })

        return {
            actions,
            loggerContext
        }
    }
    let message = `Change status from '${oldStatus}' to '${newStatus}'`;
    if (responseAPI?.status === "Success") {
        if (responseAPI.chargeId && responseAPI.chargeId !== chargeId) {
            chargeId = responseAPI.chargeId;
            actions.push(createSetCustomFieldAction(c.CTP_CUSTOM_FIELD_PAYDOCK_TRANSACTION_ID, chargeId));
        }
        actions.push(createSetCustomFieldAction(c.CTP_CUSTOM_FIELD_PAYDOCK_PAYMENT_STATUS, newStatus));
        if (refundedAmount) {
            actions.push(createSetCustomFieldAction(c.CTP_CUSTOM_FIELD_REFUNDED_AMOUNT, refundedAmount));
        }
    } else {
        errorMessage = responseAPI?.message ?? `Incorrect operation: ${message}`;
    }


    const response = errorMessage ? {status: false, message: errorMessage} : {status: true};
    const responseStatus = response.status ? "Success" : "Failed"
    if (response.status && refundedAmount) {
        response.message = "Merchant refunded money"
        message = `Refunded ${requestBodyJson.refundAmount}`
    }

    loggerContext.addPaydockLog({
        paydockChargeID: chargeId,
        operation: newStatus,
        status: responseStatus,
        message
    })
    actions.push(createSetCustomFieldAction(c.CTP_INTERACTION_PAYMENT_EXTENSION_RESPONSE, response));
    if (paymentStatus && orderStatus) {
        await updateOrderStatus(orderNumber, paymentStatus, orderStatus)
    }
    return {
        actions,
        loggerContext
    }
}


async function processPaymentStatusChange(paymentObject, requestBodyJson) {
    let paymentStatus;
    let error;
    let orderStatus;
    let responseAPI;
    const newStatus = requestBodyJson.newStatus;
    const oldStatus = paymentObject.custom.fields.PaydockPaymentStatus;
    const chargeId = paymentObject.custom.fields?.PaydockTransactionId;
    let refundedAmount = 0;
    switch (newStatus) {
        case c.STATUS_TYPES.PAID:
        case c.STATUS_TYPES.P_PAID:
            if (oldStatus === c.STATUS_TYPES.AUTHORIZE) {
                const capturedAmount = requestBodyJson.capturedAmount || 0;
                responseAPI = await updatePaydockStatus(`/v1/charges/${chargeId}/capture`, 'post',{
                    amount: capturedAmount,
                    from_webhook: true
                });
            } else {
                error = "Charge not found or not in the desired state";
            }
            paymentStatus = 'Paid'
            orderStatus = 'Complete'
            break;
        case c.STATUS_TYPES.CANCELLED:
            if([c.STATUS_TYPES.AUTHORIZE, c.STATUS_TYPES.PAID, c.STATUS_TYPES.P_PAID].includes(oldStatus)){
                responseAPI = await updatePaydockStatus(`/v1/charges/${chargeId}/capture`, 'delete', {});
            } else {
                error = "Charge not found or not in the desired state";
            }
            paymentStatus = 'Paid'
            orderStatus = 'Cancelled'
            break;
        case c.STATUS_TYPES.REFUNDED:
        case c.STATUS_TYPES.P_REFUND:
            if ([c.STATUS_TYPES.P_REFUND, c.STATUS_TYPES.PAID, c.STATUS_TYPES.P_PAID].includes(oldStatus)) {
                const oldRefundedAmount = paymentObject?.custom?.fields?.RefundedAmount || 0;
                refundedAmount = oldRefundedAmount + requestBodyJson.refundAmount;
                responseAPI = await updatePaydockStatus(`/v1/charges/${chargeId}/refunds`, 'post', {
                    amount: requestBodyJson.refundAmount,
                    from_webhook: true
                });
            } else {
                error = "Charge not found or not in the desired state";
            }
            paymentStatus = 'Paid'
            orderStatus = 'Complete'
            break;
        default:
            error = `Unsupported status change from ${oldStatus} to ${newStatus}`;
    }
    return {newStatus, paymentStatus, responseAPI, orderStatus, error, refundedAmount}
}

async function updateOrderStatus(
    id,
    paymentStatus,
    orderStatus
) {
    const ctpClient = await config.getCtpClient()

    let order = await ctpClient.fetchOrderByNymber(ctpClient.builder.orders, id)
    if (order) {
        order = order.body
        const updateOrderActions = [
            {
                action: 'changePaymentState',
                paymentState: paymentStatus,
            },
            {
                action: 'changeOrderState',
                orderState: orderStatus
            }
        ]
        await ctpClient.update(ctpClient.builder.orders, order.id, order.version, updateOrderActions)
    }
}

export default {execute}
