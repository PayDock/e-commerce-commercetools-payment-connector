import {expect, test, jest} from '@jest/globals';

import { getVaultToken } from '../../src/service/web-component-service.js';
import { createSetCustomFieldAction } from '../../src/paymentHandler/payment-utils.js';
import handler from '../../src/paymentHandler/get-vault-token.handler.js';
import c from '../../src/config/constants.js';
// Mocking the dependencies
jest.mock('../../src/service/web-component-service.js');
jest.mock('../../src/paymentHandler/payment-utils.js');

jest.mock('../../src/config/config-loader.js', () => {
    const originalModule = jest.requireActual('../../src/config/config-loader.js');
    const loaderConfigResult = jest.requireActual('../../test-data/extentionConfig.json')

    return {
        __esModule: true,
        ...originalModule,
        loadConfig: jest.fn(() => loaderConfigResult),
    };
});

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
describe('Unit::getVaultTokenHandler::', () => {
    const paymentObject = {
        custom: {
            fields: {
                PaymentExtensionRequest: JSON.stringify({
                    action: "getVaultTokenRequest",
                    request: {
                        transactionId: 'transaction-123',
                    },
                })
            }
        },
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('should return success action when getVaultToken responds with success', async () => {
        const responseMock = {
            status: 'Success',
            token: 'vault-token-123',
        };
        getVaultToken.mockResolvedValue(responseMock);
        createSetCustomFieldAction.mockReturnValue({
            action: 'setCustomField',
            name: c.CTP_INTERACTION_PAYMENT_EXTENSION_RESPONSE,
            value: responseMock,
        });

        const result = await handler.execute(paymentObject);

        expect(createSetCustomFieldAction).toHaveBeenCalledWith(c.CTP_INTERACTION_PAYMENT_EXTENSION_RESPONSE, responseMock);
        expect(result).toEqual({
            actions: [
                {
                    action: 'setCustomField',
                    name: c.CTP_INTERACTION_PAYMENT_EXTENSION_RESPONSE,
                    value: responseMock,
                },
            ],
        });
    });
});