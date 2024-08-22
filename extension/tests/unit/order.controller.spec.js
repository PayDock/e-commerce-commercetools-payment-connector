import {jest, expect} from '@jest/globals';
import orderController from '../../src/api/order/order.controller';
import httpUtils from '../../src/utils';
import {getAuthorizationRequestHeader, hasValidAuthorizationHeader} from '../../src/validator/authentication';
import errorMessages from '../../src/validator/error-messages';

jest.mock('../../src/utils', () => ({
    getLogger: jest.fn(() => ({
        debug: jest.fn(),
        error: jest.fn(),
    })),
    handleUnexpectedPaymentError: jest.fn(),
    sendResponse: jest.fn(),
    collectRequestData: jest.fn(),
}));

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
jest.mock('../../src/validator/authentication');
jest.mock('serialize-error', () => ({
    serializeError: jest.fn((error) => error),
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

describe('order.controller.js', () => {
    let mockRequest;
    let mockResponse;
    let mockLogger;

    beforeEach(() => {
        mockRequest = {
            method: 'POST',
            headers: {},
        };

        mockResponse = {
            statusCode: null,
            data: null,
            send: jest.fn((data) => {
                mockResponse.data = data;
            }),
        };

        mockLogger = {
            debug: jest.fn(),
            error: jest.fn(),
        };
        httpUtils.getLogger.mockReturnValue(mockLogger);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should return 400 for non-POST requests', async () => {
        mockRequest.method = 'GET';

        await orderController.processRequest(mockRequest, mockResponse);

        expect(httpUtils.sendResponse).toHaveBeenCalledWith({
            response: mockResponse,
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
    });

    test('should return 400 for unauthorized requests', async () => {
        getAuthorizationRequestHeader.mockReturnValue('invalid-token');
        hasValidAuthorizationHeader.mockReturnValue(false);

        await orderController.processRequest(mockRequest, mockResponse);

        expect(httpUtils.sendResponse).toHaveBeenCalledWith({
            response: mockResponse,
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
    });

    test('should return 200 and set order number if orderNumber is empty', async () => {
        const orderObject = { id: '12345' };
        getAuthorizationRequestHeader.mockReturnValue('valid-token');
        hasValidAuthorizationHeader.mockReturnValue(true);
        httpUtils.collectRequestData.mockResolvedValue(JSON.stringify({ resource: { obj: orderObject } }));

        await orderController.processRequest(mockRequest, mockResponse);

        expect(httpUtils.sendResponse).toHaveBeenCalledWith({
            response: mockResponse,
            statusCode: 200,
            data: {
                actions: [
                    {
                        action: 'setOrderNumber',
                        orderNumber: '12345',
                    },
                ],
            },
        });
    });

    test('should return 200 with empty actions if orderNumber exists', async () => {
        const orderObject = { orderNumber: '12345' };
        getAuthorizationRequestHeader.mockReturnValue('valid-token');
        hasValidAuthorizationHeader.mockReturnValue(true);
        httpUtils.collectRequestData.mockResolvedValue(JSON.stringify({ resource: { obj: orderObject } }));

        await orderController.processRequest(mockRequest, mockResponse);

        expect(httpUtils.sendResponse).toHaveBeenCalledWith({
            response: mockResponse,
            statusCode: 200,
            data: { actions: [] },
        });
    });
});
