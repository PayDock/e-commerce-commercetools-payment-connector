import fetch from 'node-fetch'
import {serializeError} from 'serialize-error'
import config from '../../config/config.js'



async function callPaydock(url, data, method) {
    let returnedRequest
    let returnedResponse
    url = await generatePaydockUrlAction(url)
    try {
        const {response, request} = await fetchAsyncPaydock(url, data, method)
        returnedRequest = request
        returnedResponse = response
    } catch (err) {
        returnedRequest = {body: JSON.stringify(data)}
        returnedResponse = serializeError(err)
    }

    return {request: returnedRequest, response: returnedResponse}
}

async function generatePaydockUrlAction(url) {
    const apiUrl = await config.getPaydockApiUrl()
    return apiUrl + url
}

async function fetchAsyncPaydock(
    url,
    requestObj,
    method
) {
    let response
    let responseBody
    let responseBodyInText
    const request = await buildRequestPaydock(requestObj, method)

    try {
        response = await fetch(url, request)
        responseBodyInText = await response.text()
        responseBody = responseBodyInText ? JSON.parse(responseBodyInText) : ''
    } catch (err) {
        if (response)
            // Handle non-JSON format response
            throw new Error(
                `Unable to receive non-JSON format resposne from Paydock API : ${responseBodyInText}`
            )
        // Error in fetching URL
        else throw err
    } finally {
        if (responseBody.additionalData) {
            delete responseBody.additionalData
        }
    }
    return {response: responseBody, request}
}

async function buildRequestPaydock(requestObj, methodOverride) {
    const paydockCredentials = await config.getPaydockConfig('connection')
    const requestHeaders = {
        'Content-Type': 'application/json',
        'x-user-secret-key': paydockCredentials.credentials_secret_key
    }

    const request = {
        method: methodOverride || 'POST',
        headers: requestHeaders
    }
    if (methodOverride !== 'GET') {
        request.body = JSON.stringify(requestObj)
    }
    return request
}


export {
    callPaydock
}
