
function createSetCustomFieldAction(name, response) {
    if(typeof response === 'object'){
        response = JSON.stringify(response);
    }
    return {
        action: 'setCustomField',
        name,
        value: response,
    }
}

function deleteCustomFieldAction(name) {
    return {
        action: 'setCustomField',
        name,
        value: null
    }
}

function isValidMetadata(str) {
    if (!str) return false
    return str.indexOf(' ') < 0
}

function getPaymentKeyUpdateAction(paymentKey, request, response) {
    const reference = request.reference?.toString()
    const pspReference = response.pspReference?.toString()
    const newReference = pspReference || reference
    let paymentKeyUpdateAction
    // ensure the key and new reference is different, otherwise the error with
    // 'code': 'InvalidOperation', 'message': ''key' has no changes.' will return by commercetools API.
    if (newReference !== paymentKey) {
        paymentKeyUpdateAction = {
            action: 'setKey',
            key: newReference,
        }
    }
    return paymentKeyUpdateAction
}



function createAddTransactionAction({
                                        type,
                                        state,
                                        amount,
                                        currency,
                                        interactionId,
                                        custom,
                                    }) {
    return {
        action: 'addTransaction',
        transaction: {
            type,
            amount: {
                currencyCode: currency,
                centAmount: amount,
            },
            state,
            interactionId,
            custom,
        },
    }
}

function createAddTransactionActionByResponse(amount, currencyCode, response) {
    // eslint-disable-next-line default-case
    switch (response.resultCode) {
        case 'Authorised':
            return createAddTransactionAction({
                type: 'Authorization',
                state: 'Success',
                amount,
                currency: currencyCode,
                interactionId: response.pspReference,
            })
        case 'Refused':
        case 'Error':
            return createAddTransactionAction({
                type: 'Authorization',
                state: 'Failure',
                amount,
                currency: currencyCode,
                interactionId: response.pspReference,
            })
    }
    return null
}

export {
    createSetCustomFieldAction,
    isValidMetadata,
    createAddTransactionAction,
    getPaymentKeyUpdateAction,
    createAddTransactionActionByResponse,
    deleteCustomFieldAction
}
