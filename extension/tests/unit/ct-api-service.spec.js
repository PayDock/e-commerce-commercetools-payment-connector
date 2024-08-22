import { expect,  jest } from '@jest/globals';
import { updateOrderPaymentState } from '../../src/service/ct-api-service.js';
import config from '../../src/config/config.js';
import ctp from '../../src/ctp.js';
import { serializeError } from 'serialize-error';

jest.mock('../../src/config/config.js');
jest.mock('../../src/ctp.js', () => ({
    get: jest.fn(),
}));

jest.mock('../../src/config/config-loader.js', () => {
    const originalModule = jest.requireActual('../../src/config/config-loader.js');
    const loaderConfigResult = jest.requireActual('../../test-data/extentionConfig.json')

    return {
        __esModule: true,
        ...originalModule,
        loadConfig: jest.fn(() => loaderConfigResult),
    };
});

describe('ct-api-service.js', () => {
    let mockCtpClient;

    beforeEach(() => {
        jest.clearAllMocks();

        mockCtpClient = {
            fetchByKey: jest.fn(),
            update: jest.fn(),
            builder: {
                payments: 'mockPaymentsPath',
            },
        };

        ctp.get.mockResolvedValue(mockCtpClient);
        config.getExtensionConfig.mockReturnValue({});
    });

    describe('updateOrderPaymentState', () => {

        test('should throw an error when updatePaymentByKey fails', async () => {
            const paymentObject = {
                id: 'payment-id-123',
                version: 1,
            };

            mockCtpClient.fetchByKey.mockResolvedValue({ body: paymentObject });
            mockCtpClient.update.mockRejectedValue(new Error('Update failed'));

            await expect(updateOrderPaymentState('order-id-123', 'Paid')).rejects.toThrow('Unexpected error on payment update with ID: payment-id-123.');
        });
    });

    describe('getPaymentByKey', () => {
        test('should return null when payment is not found', async () => {
            mockCtpClient.fetchByKey.mockRejectedValue({ statusCode: 404 });

            const result = await updateOrderPaymentState('order-id-123', 'Paid');

            expect(result).toBe(false);
            expect(mockCtpClient.fetchByKey).toHaveBeenCalledWith('mockPaymentsPath', 'order-id-123');
        });

        test('should throw an error when fetch fails', async () => {
            const error = new Error('Fetch failed');
            mockCtpClient.fetchByKey.mockRejectedValue(error);

            await expect(updateOrderPaymentState('order-id-123', 'Paid')).rejects.toThrow(`Failed to fetch a paymentError: ${JSON.stringify(serializeError(error))}`);
        });
    });
});
