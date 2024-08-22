import {jest, expect} from "@jest/globals";

import notificationHandler from '../../src/handler/notification/notification.handler.js';
import customObjectsUtils from '../../src/utils/custom-objects-utils.js';

import ctp from '../../src/utils/ctp.js';

const request = require('supertest');
const {setupServer} = require("../../src/server.js");

const {processNotification} = notificationHandler;
const data = require('../../test-data/handler/notification/data.handler.request.json');

const dataSuccess = require('../../test-data/handler/notification/transaction-success.request.json');

const paymentObject = require('../../test-data/handler/notification/payment-object.json');

const dataUnknownEvent = {notification: {reference: 'payment-key'}, event: 'unknown_event'};

jest.mock('../../src/utils/ctp.js');
jest.mock('../../src/config/config-loader.js');
jest.mock('../../src/utils/custom-objects-utils.js', () => ({
    setItem: jest.fn(),
    getItem: jest.fn(),
    removeItem: jest.fn()
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
jest.mock('../../src/handler/notification/paydock-api-service.js', () => ({
    callPaydock: jest.fn()
}));

jest.mock('../../src/config/config-loader.js', () => {
    const originalModule = jest.requireActual('../../src/config/config-loader.js');
    const loaderConfigResult = jest.requireActual('../../test-data/notificationConfig.json')

    return {
        __esModule: true,
        ...originalModule,
        loadConfig: jest.fn(() => loaderConfigResult),
    };
});
let ctpClient;
let updateAction;


describe('processNotification', () => {

    beforeEach(() => {
        ctpClient = {
            builder: {
                payments: {
                    type: 'payments',
                    endpoint: '/payments',
                    features: ['create', 'update', 'delete', 'query', 'queryOne', 'queryExpand']
                }
            },
            fetchById: jest.fn(() => ({
                body: {
                    id: "12345678-9abc-def0-1234-56789abcdef0",
                    version: 3
                }
            })),
            update: jest.fn(),
            create: jest.fn(),
            fetchOrderByNymber: jest.fn(() => ({
                body: {
                    id: "23456789-abcd-ef01-2345-6789abcdef01",
                    version: 3
                }
            }))
        }
        updateAction = [
            {
                action: 'setCustomField',
                name: 'PaydockPaymentStatus',
                value: null
            },
            {
                action: 'setCustomField',
                name: 'PaymentExtensionRequest',
                value: JSON.stringify({
                    action: 'FromNotification',
                    request: {}
                })
            }
        ];

        ctp.get.mockResolvedValue(ctpClient);

    })
    afterEach(() => {
        jest.clearAllMocks();
    })

    test('should return failure when reference is missing', async () => {
        const result = await processNotification({notification: {}, event: 'transaction_success'});

        expect(result).toEqual({status: 'Failure', message: 'Reference not found'});
    });

    test('should process transaction success notification', async () => {
        ctpClient.fetchById.mockResolvedValueOnce({
            body: paymentObject,
        });

        const result = await processNotification(dataSuccess);

        expect(result.status).toBe('Success');
        expect(ctpClient.update).toHaveBeenCalled();
    });


    test('should return failure when event is unknown', async () => {
        const result = await processNotification(dataUnknownEvent);

        expect(result).toEqual({status: 'Failure', message: 'Notification Event not found'});
    });


    describe('handler::notification::notification.handler', () => {
        const server = setupServer();

        beforeEach(() => {
            ctpClient = {
                builder: {
                    payments: {
                        type: 'payments',
                        endpoint: '/payments',
                        features: ['create', 'update', 'delete', 'query', 'queryOne', 'queryExpand']
                    }
                },
                fetchById: jest.fn(() => ({
                    body: {
                        id: "12345678-9abc-def0-1234-56789abcdef0",
                        version: 3
                    }
                })),
                update: jest.fn(),
                create: jest.fn(),
                fetchOrderByNymber: jest.fn(() => ({
                    body: {
                        id: "23456789-abcd-ef01-2345-6789abcdef01",
                        version: 3
                    }
                }))
            }
            updateAction = [
                {
                    action: 'setCustomField',
                    name: 'PaydockPaymentStatus',
                    value: null
                },
                {
                    action: 'setCustomField',
                    name: 'PaymentExtensionRequest',
                    value: JSON.stringify({
                        action: 'FromNotification',
                        request: {}
                    })
                }
            ];

            ctp.get.mockResolvedValue(ctpClient);

            server.listen(3001, 'localhost');
        })
        afterEach(() => {
            data.data.reference = '12345678-9abc-def0-1234-56789abcdef0';
            server.close();
            jest.clearAllMocks();
        })

        test('not POST request', () => request(server)
            .get('/')
            .expect(200)
            .then((response) => {
                expect(response.text).toEqual('')
            })
        )

        test('not found reference', () => {
            data.event = 'transaction_success';
            data.data.reference = null;

            updateAction[0].value = 'paydock-paid';

            return request(server)
                .post('/')
                .send(data)
                .expect(200)
                .then((response) => {
                    expect(response.text).toEqual(JSON.stringify({notificationResponse: "[accepted]"}))
                })
        })

        test('transaction success with status paid', () => {
            data.event = 'transaction_success';
            data.data.status = 'complete';
            data.data.capture = true;

            updateAction[0].value = 'paydock-paid';

            return request(server)
                .post('/')
                .send(data)
                .expect(200)
                .then((response) => {
                    // check if function was called with correct parameter.
                    expect(ctpClient.fetchById.mock.calls[0][1]).toBe('12345678-9abc-def0-1234-56789abcdef0')
                    expect(response.text).toEqual(JSON.stringify({notificationResponse: "[accepted]"}))
                })
        })


        test('transaction success paydock-refunded', () => {
            data.event = 'transaction_success';
            data.data.status = 'refunded';
            data.data.capture = false;

            updateAction[0].value = 'paydock-refunded';

            return request(server)
                .post('/')
                .send(data)
                .expect(200)
                .then((response) => {
                    // check if function was called with correct parameter.
                    expect(ctpClient.fetchById.mock.calls[0][1]).toBe('12345678-9abc-def0-1234-56789abcdef0')

                    // check if function was called with correct parameters.
                    expect(ctpClient.update.mock.calls[0][1]).toBe('12345678-9abc-def0-1234-56789abcdef0')
                    expect(ctpClient.update.mock.calls[0][2]).toBe(3)
                    expect(ctpClient.update.mock.calls[0][3]).toStrictEqual(updateAction)

                    // check if function was called with correct parameters.
                    expect(ctpClient.fetchOrderByNymber.mock.calls[0][1]).toBe('12345678-9abc-def0-1234-56789abcdef0')
                    // check what function was call one time.
                    expect(ctpClient.fetchOrderByNymber.mock.calls).toHaveLength(1)

                    expect(response.text).toEqual(JSON.stringify({notificationResponse: "[accepted]"}))
                })
        })

        test('transaction success with status requested', () => {
            data.event = 'transaction_success';
            data.data.status = 'requested';
            data.data.capture = false;

            updateAction[0].value = 'paydock-requested';

            return request(server)
                .post('/')
                .send(data)
                .expect(200)
                .then((response) => {
                    // check if function was called with correct parameter.
                    expect(ctpClient.fetchById.mock.calls[0][1]).toBe('12345678-9abc-def0-1234-56789abcdef0')

                    // check if function was called with correct parameters.
                    expect(ctpClient.update.mock.calls[0][1]).toBe('12345678-9abc-def0-1234-56789abcdef0')
                    expect(ctpClient.update.mock.calls[0][2]).toBe(3)
                    expect(ctpClient.update.mock.calls[0][3]).toStrictEqual(updateAction)

                    // check if function was called with correct parameters.
                    expect(ctpClient.fetchOrderByNymber.mock.calls[0][1]).toBe('12345678-9abc-def0-1234-56789abcdef0')
                    // check what function was call one time.
                    expect(ctpClient.fetchOrderByNymber.mock.calls).toHaveLength(1)

                    expect(response.text).toEqual(JSON.stringify({notificationResponse: "[accepted]"}))
                })
        })

        test('transaction success (status declined) #1', () => {
            data.event = 'transaction_success';
            data.data.status = 'declined';
            data.data.capture = false;

            updateAction[0].value = 'paydock-failed';

            return request(server)
                .post('/')
                .send(data)
                .expect(200)
                .then((response) => {
                    // check if function was called with correct parameter.
                    expect(ctpClient.fetchById.mock.calls[0][1]).toBe('12345678-9abc-def0-1234-56789abcdef0')

                    // check if function was called with correct parameters.
                    expect(ctpClient.update.mock.calls[0][1]).toBe('12345678-9abc-def0-1234-56789abcdef0')
                    expect(ctpClient.update.mock.calls[0][2]).toBe(3)
                    expect(ctpClient.update.mock.calls[0][3]).toStrictEqual(updateAction)

                    // check if function was called with correct parameters.
                    expect(ctpClient.fetchOrderByNymber.mock.calls[0][1]).toBe('12345678-9abc-def0-1234-56789abcdef0')
                    // check what function was call one time.
                    expect(ctpClient.fetchOrderByNymber.mock.calls).toHaveLength(1)

                    expect(response.text).toEqual(JSON.stringify({notificationResponse: "[accepted]"}))
                })
        })

        test('transaction success paydock-failed capture false', () => {
            data.event = 'transaction_success';
            data.data.status = 'failed';
            data.data.capture = false;

            updateAction[0].value = 'paydock-failed';

            return request(server)
                .post('/')
                .send(data)
                .expect(200)
                .then((response) => {
                    // check if function was called with correct parameter.
                    expect(ctpClient.fetchById.mock.calls[0][1]).toBe('12345678-9abc-def0-1234-56789abcdef0')

                    // check if function was called with correct parameters.
                    expect(ctpClient.update.mock.calls[0][1]).toBe('12345678-9abc-def0-1234-56789abcdef0')
                    expect(ctpClient.update.mock.calls[0][2]).toBe(3)
                    expect(ctpClient.update.mock.calls[0][3]).toStrictEqual(updateAction)

                    // check if function was called with correct parameters.
                    expect(ctpClient.fetchOrderByNymber.mock.calls[0][1]).toBe('12345678-9abc-def0-1234-56789abcdef0')
                    // check what function was call one time.
                    expect(ctpClient.fetchOrderByNymber.mock.calls).toHaveLength(1)

                    expect(response.text).toEqual(JSON.stringify({notificationResponse: "[accepted]"}))
                })
        })
        test('missing status in notification', () => {
            data.event = 'transaction_success';
            delete data.data.status;
            data.data.capture = true;

            return request(server)
                .post('/')
                .send(data)
                .expect(200)
                .then((response) => {
                    expect(ctpClient.fetchById.mock.calls[0][1]).toBe('12345678-9abc-def0-1234-56789abcdef0');
                    expect(response.text).toEqual(JSON.stringify({notificationResponse: "[accepted]"}));
                });
        });

        test('handling multiple events in quick succession', async () => {
            data.event = 'transaction_success';
            data.data.status = 'complete';
            data.data.capture = true;

            const firstRequest = request(server)
                .post('/')
                .send(data)
                .expect(200)
                .then((response) => {
                    expect(response.text).toEqual(JSON.stringify({notificationResponse: "[accepted]"}));
                });

            data.event = 'transaction_failure';
            data.data.status = 'failed';

            const secondRequest = request(server)
                .post('/')
                .send(data)
                .expect(200)
                .then((response) => {
                    expect(response.text).toEqual(JSON.stringify({notificationResponse: "[accepted]"}));
                });

            return Promise.all([firstRequest, secondRequest]);
        });
    })

    describe('process fraud notification', () => {
        let fraudNotification;
        let cacheFraudData;
        beforeEach(() => {
            fraudNotification = jest.requireActual('../../test-data/handler/notification/transaction-success.fraud.request.json');
            cacheFraudData = jest.requireActual('../../test-data/handler/notification/cache.fraud.data.json');
            ctpClient = {
                builder: {
                    payments: {type: 'payments', endpoint: '/payments'},
                    orders: {type: 'orders', endpoint: '/orders'},
                },
                update: jest.fn(),
                fetchById: jest.fn().mockResolvedValue({body: paymentObject}),
                fetchOrderByNymber: jest.fn(),
            };

            customObjectsUtils.removeItem.mockClear();
            customObjectsUtils.getItem.mockClear();
            ctp.get.mockResolvedValue(ctpClient);
        });

        test('should handle incomplete fraud notification', async () => {
            jest.spyOn(customObjectsUtils, 'removeItem');
            customObjectsUtils.getItem.mockResolvedValue(JSON.stringify(cacheFraudData));
            fraudNotification.notification.status = 'decline'
            const result = await processNotification(fraudNotification);
            expect(result.paydockStatus).toBe('paydock-failed');
        });

        test('should handle complete fraud notification', async () => {
            customObjectsUtils.getItem.mockResolvedValue(JSON.stringify(cacheFraudData));
            fraudNotification.notification.status = 'complete';
            const result = await processNotification(fraudNotification);
            expect(result.status).toBe('Success');
        });

        test('should handle complete fraud notification with 3ds', async () => {
            cacheFraudData._3ds = 1;
            customObjectsUtils.getItem.mockResolvedValue(JSON.stringify(cacheFraudData));
            fraudNotification.notification.status = 'complete';
            const result = await processNotification(fraudNotification);
            expect(result.status).toBe('Success');
        });
        test('should return failure when notification reference is missing', async () => {
            fraudNotification.notification.reference = undefined;
            const result = await processNotification(fraudNotification);

            expect(result).toEqual({
                status: 'Failure',
                message: 'Reference not found',
            });
        });
    });
})
;


describe('processRefundSuccessNotification', () => {
    let refundSuccess;
    beforeEach(() => {
        refundSuccess = jest.requireActual('../../test-data/handler/notification/refund-success.request.json');
        ctpClient = {
            builder: {
                payments: {type: 'payments', endpoint: '/payments'},
                orders: {type: 'orders', endpoint: '/orders'},
            },
            update: jest.fn(),
            fetchById: jest.fn().mockResolvedValue({body: paymentObject}),
            fetchOrderByNymber: jest.fn(),
        };

        customObjectsUtils.removeItem.mockClear();
        customObjectsUtils.getItem.mockClear();
        ctp.get.mockResolvedValue(ctpClient);
    });

    test('test refund success', async () => {
        const result = await processNotification(refundSuccess);
        expect(result).toEqual({
            status: 'Success',
            message: 'Refunded 10',
        });
    });
});