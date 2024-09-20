import {jest, expect} from '@jest/globals';
import paymentHandler from '../../src/paymentHandler/payment-handler.js';
import getPaymentMethodsHandler from '../../src/paymentHandler/get-payment-methods.handler.js';
import {deleteCustomFieldAction} from '../../src/paymentHandler/payment-utils.js';
import c from "../../src/config/constants.js";
import errorMessages from '../../src/validator/error-messages.js';
import {withPayment} from '../../src/validator/validator-builder.js';

jest.mock('../../src/paymentHandler/make-payment.handler.js');
jest.mock('../../src/paymentHandler/get-vault-token.handler.js');
jest.mock('../../src/paymentHandler/get-payment-methods.handler.js');
jest.mock('../../src/paymentHandler/payment-utils.js');
jest.mock('../../src/validator/validator-builder.js');
jest.mock('../../src/config/config-loader.js', () => {
    const originalModule = jest.requireActual('../../src/config/config-loader.js');
    const loaderConfigResult = jest.requireActual('../../test-data/extentionConfig.json');

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

describe('Payment Handler', () => {
    const paymentObject = jest.requireActual('../../test-data/paymentHandler/payment-object.json');
    beforeEach(() => {
        jest.clearAllMocks();

        const mockValidator = {
            validateMetadataFields: jest.fn(),
            validateAuthorizationHeader: jest.fn(),
            hasErrors: jest.fn().mockReturnValue(false),
            getErrors: jest.fn().mockReturnValue(null),
            };
            withPayment.mockReturnValue(mockValidator);
    });

    describe('handlePaymentByExtRequest', () => {
        test('should return null if actionExtension is missing', async () => {
            paymentObject.custom.fields.PaymentExtensionRequest = JSON.stringify({});
            const result = await paymentHandler.handlePaymentByExtRequest(paymentObject, 'authToken');
            expect(result).toBeNull();
        });

        test('should return actions and version from the correct handler when valid', async () => {
            getPaymentMethodsHandler.execute.mockResolvedValue({
                actions: ['getPaymentMethodsAction'],
                version: 2
            });
            paymentObject.custom.fields.PaymentExtensionRequest = JSON.stringify({
                action: c.CTP_CUSTOM_FIELD_GET_PAYMENT_METHODS_REQUEST
            });
            const result = await paymentHandler.handlePaymentByExtRequest(paymentObject, 'authToken');

            expect(getPaymentMethodsHandler.execute).toHaveBeenCalledWith(paymentObject);
            expect(result.actions).toEqual(['getPaymentMethodsAction', deleteCustomFieldAction.mock.results[0].value]);
            expect(result.version).toBe(2);
        });
    });
});
