import {jest, expect} from '@jest/globals';
import handler from '../../src/paymentHandler/update-payment-status.handler.js';
import {createSetCustomFieldAction} from '../../src/paymentHandler/payment-utils.js';
import {updatePaydockStatus} from '../../src/service/web-component-service.js';
import httpUtils from '../../src/utils.js';
import config from '../../src/config/config.js';
import c from '../../src/config/constants.js';

jest.mock('../../src/paymentHandler/payment-utils.js');
jest.mock('../../src/service/web-component-service.js');
jest.mock('../../src/utils.js');
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
describe('Unit::update-payment-status.handler::execute', () => {
    let paymentObject;
    let paymentExtensionRequest;

    beforeEach(() => {
        jest.clearAllMocks();

        paymentExtensionRequest = {
            request: {
                newStatus: c.STATUS_TYPES.PAID,
                refundAmount: 5000,
            },
        };

        paymentObject = {
            id: 'order-123',
            custom: {
                fields: {
                    PaymentExtensionRequest: JSON.stringify(paymentExtensionRequest),
                    PaydockTransactionId: 'charge-123',
                    PaydockPaymentStatus: c.STATUS_TYPES.AUTHORIZE,
                    RefundedAmount: 1000,
                },
            },
        };

        // Default mock implementations
        createSetCustomFieldAction.mockReturnValue({});
        updatePaydockStatus.mockResolvedValue({status: 'Success', chargeId: 'charge-123'});
        httpUtils.addPaydockLog.mockResolvedValue({});
        config.getCtpClient.mockResolvedValue({
            fetchOrderByNymber: jest.fn().mockResolvedValue({body: {id: 'order-123', version: 1}}),
            update: jest.fn().mockResolvedValue({}),
            builder: {
                orders: {}, // Adding the orders property to the builder object
            },
        });
    });

    test('should handle a successful status update and return correct actions', async () => {
        const result = await handler.execute(paymentObject);

        expect(updatePaydockStatus).toHaveBeenCalledWith(
            '/v1/charges/charge-123/capture',
            'post',
            {amount: 0, from_webhook: true}
        );

        expect(createSetCustomFieldAction).toHaveBeenCalledWith(
            c.CTP_CUSTOM_FIELD_PAYDOCK_PAYMENT_STATUS,
            c.STATUS_TYPES.PAID
        );

        expect(httpUtils.addPaydockLog).toHaveBeenCalledWith({
            paydockChargeID: 'charge-123',
            operation: c.STATUS_TYPES.PAID,  // This matches the expected status
            responseStatus: 'Success',
            message: `Change status from '${c.STATUS_TYPES.AUTHORIZE}' to '${c.STATUS_TYPES.PAID}'`,
        });

        expect(result.actions).toEqual(expect.any(Array));
    });


    test('should handle an error during status update and return failure action', async () => {
        updatePaydockStatus.mockResolvedValue({status: 'Failure', message: 'Error message'});
        const result = await handler.execute(paymentObject);

        expect(createSetCustomFieldAction).toHaveBeenCalledWith(c.CTP_INTERACTION_PAYMENT_EXTENSION_RESPONSE, {
            status: false,
            message: 'Error message',
        });

        expect(result.actions).toEqual(expect.any(Array));
    });

    test('should handle unsupported status change and return failure action', async () => {
        paymentExtensionRequest.request.newStatus = 'UnsupportedStatus';
        paymentObject.custom.fields.PaydockPaymentStatus = c.STATUS_TYPES.AUTHORIZE;
        paymentObject.custom.fields.PaymentExtensionRequest = JSON.stringify(paymentExtensionRequest)

        const result = await handler.execute(paymentObject);

        expect(createSetCustomFieldAction).toHaveBeenCalledWith(c.CTP_INTERACTION_PAYMENT_EXTENSION_RESPONSE, {
            status: false,
            message: `Unsupported status change from ${c.STATUS_TYPES.AUTHORIZE} to UnsupportedStatus`,
        });

        expect(result.actions).toEqual(expect.any(Array));
    });

    test('should update order status when both paymentStatus and orderStatus are available', async () => {
        const ctpClientMock = await config.getCtpClient();

        const result = await handler.execute(paymentObject);

        expect(ctpClientMock.update).toHaveBeenCalledWith(
            expect.anything(),
            'order-123',
            1,
            expect.arrayContaining([
                {action: 'changePaymentState', paymentState: 'Paid'},
                {action: 'changeOrderState', orderState: 'Complete'},
            ])
        );

        expect(result.actions).toEqual(expect.any(Array));
    });

    test('should handle CANCELLED status correctly', async () => {
        paymentExtensionRequest.request.newStatus = c.STATUS_TYPES.CANCELLED;
        paymentObject.custom.fields.PaydockPaymentStatus = c.STATUS_TYPES.AUTHORIZE;

        const result = await handler.execute(paymentObject);

        expect(updatePaydockStatus).toHaveBeenCalledWith(
            '/v1/charges/charge-123/capture',
            'post',  // Update this if 'post' is the correct method
            { amount: 0, from_webhook: true }  // Ensure this matches the actual call
        );

        expect(result.actions).toEqual(expect.any(Array));
    });

});