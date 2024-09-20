import {serializeError} from 'serialize-error'
import config from '../config/config.js'
import ctp from "../ctp.js";

async function updateOrderPaymentState(orderId, status) {
    const ctpConfig = config.getExtensionConfig()
    const ctpClient = await ctp.get(ctpConfig)
    const paymentObject = await getPaymentByKey(ctpClient, orderId)
    if (paymentObject) {
        const updateData = [{
            action: 'setCustomField',
            name: 'PaydockPaymentStatus',
            value: status
        }]

        const updatedOrder = await updatePaymentByKey(ctpClient, paymentObject, updateData);
        if (updatedOrder.statusCode === 200) {
            return true;
        }
    }
    return false;
}


async function getPaymentByKey(ctpClient, paymentKey) {
    try {
        const result = await ctpClient.fetchByKey(ctpClient.builder.payments, paymentKey)
        return result.body
    } catch (err) {
        if (err.statusCode === 404) return null
        const errMsg =
            `Failed to fetch a payment` +
            `Error: ${JSON.stringify(serializeError(err))}`
        throw new Error(errMsg)
    }
}

async function updatePaymentByKey(ctpClient, paymentObject, updateData) {
    try {
        await ctpClient.update(
            ctpClient.builder.payments,
            paymentObject.id,
            paymentObject.version,
            updateData
        )
    } catch (err) {
        const errMsg =
            `Unexpected error on payment update with ID: ${paymentObject.id}.` +
            `Failed actions: ${JSON.stringify(err)}`
        throw new Error(errMsg)
    }
}

export {
    updateOrderPaymentState
}
