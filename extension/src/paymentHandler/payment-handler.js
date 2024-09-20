import {withPayment} from '../validator/validator-builder.js'
import makePaymentHandler from './make-payment.handler.js'
import getVaultTokenHandler from './get-vault-token.handler.js'
import getPaymentMethodsHandler from './get-payment-methods.handler.js'
import updatePaymentStatusHandler from './update-payment-status.handler.js'
import makePreChargeHandler from './make-pre-chrage.handler.js'
import getStandaloneTokenHandler from './get-standalone-3ds-token.handler.js'
import utils from "../utils.js";

import c from "../config/constants.js";
import {
    deleteCustomFieldAction
} from './payment-utils.js'


async function handlePaymentByExtRequest(paymentObject, authToken) {

    const validatePaymentErrors = _validatePaymentRequest(
        paymentObject,
        authToken,
    )
    if (validatePaymentErrors) {
        return {
            errors: validatePaymentErrors,
        }
    }


    const paymentCustomFields = paymentObject?.custom?.fields;
    const paymentExtensionRequest = paymentCustomFields?.PaymentExtensionRequest ?? null;
    const additionalInformation = paymentCustomFields?.AdditionalInformation ?? null;
    if (paymentExtensionRequest === null) {
        return null
    }
    const objPaymentExtensionRequest = JSON.parse(paymentExtensionRequest);
    const actionExtension = objPaymentExtensionRequest.action ?? null;
    const handlers = [];
    if (!actionExtension || (actionExtension === 'FromNotification' && additionalInformation)) return null
    switch (actionExtension) {
        case  c.CTP_CUSTOM_FIELD_GET_PAYMENT_METHODS_REQUEST:
            handlers.push(getPaymentMethodsHandler)
            break;
        case  c.CTP_INTERACTION_TYPE_GET_VAULT_TOKEN_REQUEST:
            handlers.push(getVaultTokenHandler)
            break;
        case c.CTP_INTERACTION_TYPE_MAKE_PAYMENT_REQUEST:
            handlers.push(makePaymentHandler)
            break;
        case c.CTP_CUSTOM_FIELD_GET_STANDALONE_3DS_TOKEN_REQUEST:
            handlers.push(getStandaloneTokenHandler)
            break;
        case c.CTP_CUSTOM_GET_UPDATE_STATUS:
            handlers.push(updatePaymentStatusHandler)
            break;
        case c.CTP_CUSTOM_FIELD_MAKE_PRE_CHARGE_RESPONSE:
            handlers.push(makePreChargeHandler)
            break;
        default:
            break;
    }
    if (!handlers) return null

    const handlerResponses = await Promise.all(
        handlers.map((handler) => handler.execute(paymentObject)),
    )

    const version = handlerResponses.find((result) => result.version !== null)
    const actions = handlerResponses.flatMap((result) => result.actions)
    actions.push(deleteCustomFieldAction(c.CTP_INTERACTION_PAYMENT_EXTENSION_REQUEST))
    if (version) {
        return {
            actions,
            version: version.version
        }
    }
    return {actions}
}

function _validatePaymentRequest(paymentObject, authToken) {
    const paymentValidator = withPayment(paymentObject)
    paymentValidator.validateMetadataFields()
    if (paymentValidator.hasErrors()) return paymentValidator.getErrors()

    paymentValidator.validateAuthorizationHeader(authToken)
    if (paymentValidator.hasErrors()) return paymentValidator.getErrors()

    if (paymentValidator.hasErrors()) return paymentValidator.getErrors()
    return null
}


export default {handlePaymentByExtRequest}
