import {serializeError} from 'serialize-error';
import httpUtils from '../../utils.js';
import {getAuthorizationRequestHeader, hasValidAuthorizationHeader} from "../../validator/authentication.js";
import errorMessages from "../../validator/error-messages.js";


const logger = httpUtils.getLogger();

async function processRequest(request, response) {
    if (request.method !== 'POST') {
        return sendInvalidMethodResponse(response);
    }

    let orderObject = {};
    try {
        const authToken = getAuthorizationRequestHeader(request)
        if (!hasValidAuthorizationHeader(authToken)) {
            return sendRequestIsUnauthorized(response);
        }
        orderObject = await getOrderObject(request);
        if (orderObject.orderNumber) {
            return sendEmptyActionsResponse(response);
        }
        await updateOrderNumberIfEmpty(response, orderObject);
    } catch (err) {
        return sendErrorResponse(response, orderObject, err);
    }
    return null
}

function sendRequestIsUnauthorized(response) {

    return httpUtils.sendResponse({
        response,
        statusCode: 400,
        data: {
            errors: [
                {
                    code: 'Unauthorized',
                    message: errorMessages.UNAUTHORIZED_REQUEST,
                },
            ],
        },
    });
}

function sendInvalidMethodResponse(response) {
    return httpUtils.sendResponse({
        response,
        statusCode: 400,
        data: {
            errors: [
                {
                    code: 'InvalidInput',
                    message: 'Invalid HTTP method',
                },
            ],
        },
    });
}

function sendEmptyActionsResponse(response) {
    return httpUtils.sendResponse({response, statusCode: 200, data: {actions: []}});
}

async function updateOrderNumberIfEmpty(response, orderObject) {
    const result = {
        response,
        statusCode: 200,
        data: {
            actions: [{
                action: "setOrderNumber",
                orderNumber: orderObject.id
            }]
        }
    };
    return httpUtils.sendResponse(result);
}

function sendErrorResponse(response, orderObject, err) {
    return httpUtils.sendResponse({
        response,
        statusCode: 400,
        data: httpUtils.handleUnexpectedPaymentError(orderObject, err),
    });
}

async function getOrderObject(request) {
    try {
        const body = await httpUtils.collectRequestData(request);
        const requestBody = JSON.parse(body);
        return requestBody.resource.obj;
    } catch (err) {
        logParsingError(err);
        throw err;
    }
}

function logParsingError(err) {
    const errorStackTrace = `Error during parsing CTP request: Ending the process. Error: ${JSON.stringify(serializeError(err))}`;
    logger.error(errorStackTrace);
}

export default {processRequest};