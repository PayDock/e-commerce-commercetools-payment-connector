import {jest, expect} from '@jest/globals';
import paymentController from '../../src/api/payment/payment.controller';
import httpUtils from '../../src/utils';

jest.mock('../../src/utils');
jest.mock('../../src/validator/authentication');
jest.mock('../../src/paymentHandler/payment-handler');
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

describe('payment.controller.js', () => {
    let mockRequest;
    let mockResponse;

    beforeEach(() => {
        mockRequest = {
            method: 'POST',
            headers: {},
        };

        mockResponse = {
            statusCode: null,
            data: null,
            end: jest.fn(),
        };

        httpUtils.collectRequestData.mockResolvedValue(JSON.stringify({
            resource: {
                obj: {
                    custom: {
                        fields: {},
                    },
                },
            },
        }));

        httpUtils.sendResponse.mockImplementation(({response, statusCode, data}) => {
            response.statusCode = statusCode;
            response.data = data;
            response.end();
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('processRequest', () => {
        it('should return 400 for non-POST requests', async () => {
            mockRequest.method = 'GET';

            await paymentController.processRequest(mockRequest, mockResponse);

            expect(httpUtils.sendResponse).toHaveBeenCalledWith({
                response: mockResponse,
                statusCode: 400,
                data: {
                    errors: [
                        {
                            code: 'InvalidInput',
                            message: 'Invalid HTTP method...',
                        },
                    ],
                },
            });
        });
/*
        it('should handle payment processing and return actions', async () => {
            const mockPaymentObject = {
                custom: {
                    fields: {},
                },
            };

            // Мока повертає успішну відповідь з діями
            paymentHandler.handlePayment.mockResolvedValue({actions: [{action: 'someAction'}]});
            httpUtils.collectRequestData.mockResolvedValue(JSON.stringify({
                resource: {
                    obj: mockPaymentObject,
                },
            }));

            await paymentController.processRequest(mockRequest, mockResponse);

            expect(paymentHandler.handlePayment).toHaveBeenCalledWith(mockPaymentObject, undefined);
            expect(httpUtils.sendResponse).toHaveBeenCalledWith({
                response: mockResponse,
                statusCode: 200,
                data: {actions: [{action: 'someAction'}]},
            });
        });

        it('should handle payment processing with extension request and return actions', async () => {
            const mockPaymentObject = {
                custom: {
                    fields: {
                        PaymentExtensionRequest: JSON.stringify({some: 'request'}),
                    },
                },
            };

            paymentHandler.handlePaymentByExtRequest.mockResolvedValue({actions: [{action: 'someAction'}]});
            httpUtils.collectRequestData.mockResolvedValue(JSON.stringify({
                resource: {
                    obj: mockPaymentObject,
                },
            }));

            await paymentController.processRequest(mockRequest, mockResponse);

            expect(paymentHandler.handlePaymentByExtRequest).toHaveBeenCalledWith(mockPaymentObject, undefined);
            expect(httpUtils.sendResponse).toHaveBeenCalledWith({
                response: mockResponse,
                statusCode: 200,
                data: {actions: [{action: 'someAction'}]},
            });
        });

        it('should return 400 and log error for unexpected errors', async () => {
            const mockError = new Error('Test error');
            httpUtils.collectRequestData.mockRejectedValue(mockError);

            await paymentController.processRequest(mockRequest, mockResponse);

            expect(httpUtils.sendResponse).toHaveBeenCalledWith({
                response: mockResponse,
                statusCode: 400,
                data: expect.objectContaining({
                    errors: [
                        {
                            code: expect.any(String),
                            message: expect.any(String),
                        },
                    ],
                }),
            });

            expect(httpUtils.getLogger().error).toHaveBeenCalledWith(
                expect.stringContaining('Error during parsing CTP request')
            );
        }); */
    });
});
