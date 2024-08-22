import { expect, test, jest } from '@jest/globals';
import { setupServer } from "../../src/server.js";
import getStandalone3dsTokenHandler from '../../src/paymentHandler/get-standalone-3ds-token.handler.js';
import { createStandalone3dsToken } from '../../src/service/web-component-service.js';

jest.mock('node-fetch');
jest.mock('../../src/config/config.js');
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
jest.mock('../../src/validator/authentication.js');
jest.mock('../../src/service/web-component-service.js', () => ({
    createStandalone3dsToken: jest.fn(),
}));


describe('Integration::PaymentHandler::getStandalone3dsToken::', () => {
    const server = setupServer();

    beforeEach(async () => {
        server.listen(3001, 'localhost');
    });

    afterEach(async () => {
        server.close();
    });

    test('should handle a successful 3DS token creation and return correct response', async () => {
        const paymentObject = {
            custom: {
                fields: {
                    getStandalone3dsTokenRequest: JSON.stringify({
                        transactionId: 'transaction-123',
                        request: {
                            data: 'some-request-data'
                        }
                    })
                }
            }
        };

        const mockResponse = {
            chargeId: 'charge-789',
            status: 'Success',
            token: 'standalone-3ds-token-456'
        };

        createStandalone3dsToken.mockResolvedValue(mockResponse);

        const result = await getStandalone3dsTokenHandler.execute(paymentObject);

        expect(result).toHaveProperty('actions');
        expect(result.actions[0]).toHaveProperty('action', 'setCustomField');
        expect(result.actions[0]).toHaveProperty('name', 'getStandalone3dsTokenResponse');
        expect(result.actions[0]).toHaveProperty('value', JSON.stringify(mockResponse));
    });

    test('should handle failure in 3DS token creation', async () => {
        const paymentObject = {
            custom: {
                fields: {
                    getStandalone3dsTokenRequest: JSON.stringify({
                        transactionId: 'transaction-123',
                        request: {
                            data: 'some-request-data'
                        }
                    })
                }
            }
        };

        const mockResponse = {
            status: 'Failure',
            message: '3DS token creation failed'
        };

        createStandalone3dsToken.mockResolvedValue(mockResponse);

        const result = await getStandalone3dsTokenHandler.execute(paymentObject);

        expect(result).toHaveProperty('actions');
        expect(result.actions[0]).toHaveProperty('action', 'getStandalone3dsToken');
        expect(result.actions[0]).toHaveProperty('transactionId', 'transaction-123');
        expect(result.actions[0]).toHaveProperty('state', 'Failure');
    });
});
