import {expect, test, jest} from '@jest/globals';

import {setupServer} from "../../src/server.js";
import {getAuthorizationRequestHeader, hasValidAuthorizationHeader} from '../../src/validator/authentication.js'
import config from '../../src/config/config.js';

const request = require('supertest');
const requestData = require('../../test-data/paymentHandler/get-payment-methods.handler.request.json');
const configData = require('../../test-data/config.json');
const moduleConfigData = require('../../test-data/moduleConfig.json');
const responseData = require('../../test-data/paymentHandler/get-payment-methods.handler.response.json');
const sandboxPaymentExtensionResponse = require('../../test-data/paymentHandler/get-payment-methods.handler.sandbox-payment-extension-response.json');
const livePaymentExtensionResponse = require('../../test-data/paymentHandler/get-payment-methods.handler.sandbox-payment-extension-response.json');

jest.mock('../../src/validator/authentication.js')
jest.mock('../../src/config/config.js')

jest.mock('@commercetools-backend/loggers', () => {
    return {
        createApplicationLogger: jest.fn(() => ({
            info: jest.fn(),
            error: jest.fn(),
            warn: jest.fn(),
            debug: jest.fn(),
        })),
    };
});
jest.mock('../../src/config/config-loader.js', () => {
    const originalModule = jest.requireActual('../../src/config/config-loader.js');
    const loaderConfigResult = require('../../test-data/extentionConfig.json')

    return {
        __esModule: true,
        ...originalModule,
        loadConfig: jest.fn(() => loaderConfigResult),
    };
});
config.getModuleConfig.mockResolvedValue(moduleConfigData)
config.getCtpClient.mockResolvedValue({create: jest.fn(), builder: {customObjects: {}}})

describe('Unit::getPaymentMethods::', () => {
    const server = setupServer();

    beforeEach(() => {
        server.listen(3001, 'localhost')
    })

    afterEach(() => {
        server.close();
    });

    test('get sandbox configuration', () => {
        configData.sandbox_mode = "Yes";
        config.getPaydockConfig.mockResolvedValue(configData)
        getAuthorizationRequestHeader.mockResolvedValue('test-authorisation');
        hasValidAuthorizationHeader.mockResolvedValue(true);
        responseData.actions[0].value = JSON.stringify(sandboxPaymentExtensionResponse);

        return request(server)
            .post('/')
            .send(requestData)
            .expect(200)
            .then((response) => {
                expect(response.text).toEqual(JSON.stringify(responseData));
            })
    })

    test('get live configuration', () => {
        configData.sandbox_mode = "No";
        config.getPaydockConfig.mockResolvedValue(configData)
        getAuthorizationRequestHeader.mockResolvedValue('test-authorisation');
        hasValidAuthorizationHeader.mockResolvedValue(true);
        responseData.actions[0].value = JSON.stringify(livePaymentExtensionResponse);

        return request(server)
            .post('/')
            .send(requestData)
            .expect(200)
            .then((response) => {
                expect(response.text).toEqual(JSON.stringify(responseData));
            })
    })
})