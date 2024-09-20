import {expect, jest} from '@jest/globals';
import makePaymentHandler from '../../src/paymentHandler/make-payment.handler.js';
import {
    createSetCustomFieldAction,
    createAddTransactionActionByResponse,
    getPaymentKeyUpdateAction,
    deleteCustomFieldAction,
} from '../../src/paymentHandler/payment-utils.js';
import { makePayment } from '../../src/service/web-component-service.js';
import c from '../../src/config/constants.js';

jest.mock('../../src/config/config-loader.js', () => {
    const originalModule = jest.requireActual('../../src/config/config-loader.js');
    const loaderConfigResult = jest.requireActual('../../test-data/extentionConfig.json')

    return {
        __esModule: true,
        ...originalModule,
        loadConfig: jest.fn(() => loaderConfigResult),
    };
});
jest.mock('../../src/service/web-component-service.js');
jest.mock('../../src/paymentHandler/payment-utils.js');
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
describe('make-payment.handler', () => {
    let paymentObject;

    beforeEach(() => {
        jest.clearAllMocks();

        paymentObject = {
            amountPlanned: {
                centAmount: 10000,
                currencyCode: 'USD',
                type: 'centPrecision',
                fractionDigits: 2,
            },
            custom: {
                fields: {
                    PaymentExtensionRequest: JSON.stringify({
                        action: "makePaymentRequest",
                        request: {
                            PaydockPaymentType: 'card',
                            amount: {value: 10000, currency: 'USD'},
                            CommerceToolsUserId: 'user-123',
                            AdditionalInfo: {extra: 'info'},
                        },
                    })
                }
            }
        };
    });

    test('should handle successful payment and return correct actions', async () => {
        const mockResponse = {
            status: 'Success',
            chargeId: 'charge-123',
            paydockStatus: c.STATUS_TYPES.PAID,
        };

        makePayment.mockResolvedValue(mockResponse);
        createSetCustomFieldAction.mockImplementation((field, value) => ({ action: 'setCustomField', field, value }));
        createAddTransactionActionByResponse.mockReturnValue({ action: 'addTransaction' });
        getPaymentKeyUpdateAction.mockReturnValue({ action: 'setKey' });
        deleteCustomFieldAction.mockReturnValue({ action: 'deleteCustomField' });

        const result = await makePaymentHandler.execute(paymentObject);

        expect(result.actions).toHaveLength(9);
        expect(result.actions).toContainEqual(expect.objectContaining({
            action: 'setCustomField',
            field: c.CTP_CUSTOM_FIELD_PAYDOCK_PAYMENT_TYPE
        }));

        expect(result.actions).toContainEqual(expect.objectContaining({
            action: 'setCustomField',
            field: c.CTP_CUSTOM_FIELD_PAYDOCK_TRANSACTION_ID
        }));
    });

    test('should handle payment failure and return failure actions', async () => {
        const mockResponse = {
            status: 'Failure',
            message: 'Invalid transaction details',
        };

        makePayment.mockResolvedValue(mockResponse);
        createSetCustomFieldAction.mockImplementation((field, value) => ({ action: 'setCustomField', field, value }));
        deleteCustomFieldAction.mockReturnValue({ action: 'deleteCustomField' });

        const result = await makePaymentHandler.execute(paymentObject);

        expect(result.actions).toHaveLength(1);

        expect(result.actions).toContainEqual(expect.objectContaining({
            action: 'setCustomField',
            field: c.CTP_INTERACTION_PAYMENT_EXTENSION_RESPONSE
        }));
    });

    test('should correctly calculate captured amount with centPrecision', async () => {
        paymentObject.amountPlanned = {
            centAmount: 10000,
            currencyCode: 'USD',
            type: 'centPrecision',
            fractionDigits: 2,
        };

        const mockResponse = {
            status: 'Success',
            chargeId: 'charge-123',
            paydockStatus: c.STATUS_TYPES.PAID,
        };

        makePayment.mockResolvedValue(mockResponse);
        createSetCustomFieldAction.mockImplementation((field, value) => ({ action: 'setCustomField', field, value }));

        const result = await makePaymentHandler.execute(paymentObject);

        expect(result.actions).toEqual(expect.arrayContaining([
            expect.objectContaining({ action: 'setCustomField', field: 'CapturedAmount', value: 100.00 }),
        ]));
    });

    test('should delete appropriate custom fields after payment', async () => {
        const result = await makePaymentHandler.execute(paymentObject);
        const setCustomFieldActions = [
            { action: 'setCustomField', field: 'PaydockPaymentType' },
            { action: 'setCustomField', field: 'PaydockPaymentStatus' },
            { action: 'setCustomField', field: 'PaydockTransactionId' },
            { action: 'setCustomField', field: 'CommerceToolsUserId' },
            { action: 'setCustomField', field: 'AdditionalInformation' },
            { action: 'setKey' },
            { action: 'addTransaction' },
            { action: 'setCustomField', field: 'PaymentExtensionResponse' },
            { action: 'setCustomField', field: 'CapturedAmount' },
        ];

        setCustomFieldActions.forEach(action => {
            expect(result.actions).toEqual(expect.arrayContaining([expect.objectContaining(action)]));
        });
    });
});