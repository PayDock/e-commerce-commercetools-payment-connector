import {expect, jest} from '@jest/globals';
import * as serviceModule from '../../src/service/web-component-service.js';
import {setItem} from '../../src/utils/custom-objects-utils.js';
import {updateOrderPaymentState} from '../../src/service/ct-api-service.js';
import {callPaydock} from '../../src/service/paydock-api-service.js';
import config from '../../src/config/config.js';
import httpUtils from '../../src/utils.js';
import ctp from '../../src/ctp.js';

jest.mock('node-fetch');
jest.mock('../../src/config/config.js');
jest.mock('../../src/utils.js');

const  customerObject = jest.requireActual('../../test-data/customer-object.json');

jest.mock('@commercetools-backend/loggers', () => ({
        createApplicationLogger: jest.fn(() => ({
            info: jest.fn(),
            error: jest.fn(),
            warn: jest.fn(),
            debug: jest.fn(),
        })),
    }));
jest.mock('../../src/ctp.js', () => ({
    get: jest.fn()
}));

jest.mock('../../src/service/paydock-api-service.js', () => ({
    callPaydock: jest.fn()
}));

jest.mock('../../src/utils/custom-objects-utils.js', () => ({
    setItem: jest.fn()
}));

jest.mock('../../src/service/ct-api-service.js', () => ({
    updateOrderPaymentState: jest.fn()
}));

jest.mock('../../src/config/config-loader.js', () => {
    const originalModule = jest.requireActual('../../src/config/config-loader.js');
    const loaderConfigResult = jest.requireActual('../../test-data/extentionConfig.json');
    return {
        __esModule: true,
        ...originalModule,
        loadConfig: jest.fn(() => loaderConfigResult),
    };
});

jest.mock('../../src/utils.js', () => ({
    getLogger: jest.fn(() => ({
        info: jest.fn(),
        error: jest.fn(),
        warn: jest.fn(),
        debug: jest.fn(),
    })),
    createLogContext: jest.fn(() => ({
        addPaydockLog: jest.fn(),
        getLogsAction: jest.fn(),
        clearLog: jest.fn(),
    })),
}));

describe('web-component-service.js', () => {
    let mockCtpClient;
    let loggerContext;
    const makePaymentRequestObj = {
        orderId: 'order-123',
        PaydockTransactionId: 'charge-123',
        PaydockPaymentType: 'card',
        amount: {value: 10000, currency: 'AUD'},
        VaultToken: 'vault-token-123',
        CommerceToolsUserId: 'user-123',
        SaveCard: true,
        AdditionalInfo: {
            address_country: 'AU',
            address_city: 'Sydney',
            address_line: '123 Street',
            address_postcode: '2000',
            billing_first_name: 'John',
            billing_last_name: 'Doe',
            billing_email: 'john.doe@example.com',
            billing_phone: '0412345678',
        },
    };
    const paymentObject = jest.requireActual('../../test-data/paymentHandler/payment-object.json');
    beforeEach(() => {
        jest.clearAllMocks();
        loggerContext = {
            addPaydockLog: jest.fn(),
            getLogsAction: jest.fn(),
            clearLog: jest.fn(),
        };
        mockCtpClient = {
            fetchByKey: jest.fn(),
            fetchById: jest.fn(),
            update: jest.fn(),
            builder: {
                payments: 'mockPaymentsPath', // Mocking the payments path
                customers: 'mockCustomersPath', // Mocking the customers path
            }
        };

        ctp.get.mockResolvedValue(mockCtpClient);
        config.getPaydockConfig.mockResolvedValue({
            card_use_on_checkout: 'Yes',
            card_gateway_id: 'erw345er43234123',
            card_card_save: 'Disable',
            card_card_method_save: null,
            card_3ds: null,
            card_fraud: null,
            credentials_type: 'credentials',
            credentials_secret_key: 'secret-key-123'
        });
    });

    describe('createPreCharge', () => {
        test('should return success when the charge is created successfully', async () => {
            const mockResponse = {
                response: {
                    status: 201,
                    resource: {
                        data: {
                            token: 'precharge-token-123',
                            charge: {_id: 'charge-456'}
                        }
                    }
                }
            };

            callPaydock.mockResolvedValue(mockResponse);

            const data = {amount: 10000, currency: 'AUD'};
            const result = await serviceModule.createPreCharge(data);

            expect(callPaydock).toHaveBeenCalledWith('/v1/charges/wallet?capture=true', data, 'POST');
            expect(result.status).toBe('Success');
            expect(result.token).toBe('precharge-token-123');
            expect(result.chargeId).toBe('charge-456');
        });

        test('should return failure when the charge creation fails', async () => {
            const mockResponse = {
                response: {
                    status: 400,
                    error: {message: 'Charge creation failed'},
                },
            };

            callPaydock.mockResolvedValue(mockResponse);

            const data = {amount: 10000, currency: 'AUD'};
            const result = await serviceModule.createPreCharge(data);

            expect(callPaydock).toHaveBeenCalledWith('/v1/charges/wallet?capture=true', data, 'POST');
            expect(result.status).toBe('Failure');
            expect(result.message).toBe('Charge creation failed');
        });
    });

    describe('getVaultToken', () => {
        test('should return a vault token successfully', async () => {
            callPaydock.mockResolvedValue({
                response: {
                    status: 201,
                    resource: {
                        data: {
                            vault_token: 'vault-token-123',
                        },
                    },
                },
            });

            const requestObj = {
                data: {},
                userId: 'user-123',
                saveCard: true,
                type: 'card',
            };

            const result = await serviceModule.getVaultToken(requestObj);

            expect(callPaydock).toHaveBeenCalledWith('/v1/vault/payment_sources/', requestObj.data, 'POST');
            expect(result.status).toBe('Success');
            expect(result.token).toBe('vault-token-123');
        });
    });

    describe('createVaultToken', () => {
        test('should return success when the vault token is created successfully', async () => {
            callPaydock.mockResolvedValue({
                response: {
                    status: 201,
                    resource: {
                        data: {
                            vault_token: 'vault-token-123',
                        },
                    },
                },
            });

            const data = {card_number: '4111111111111111', cvv: '123', expire_month: '12', expire_year: '2025'};
            const requestObj = {
                data,
                userId: 'user-123',
                saveCard: true,
                type: 'card',
                configurations: {credentials_type: 'credentials', credentials_secret_key: 'secret-key-123'},
            };

            const result = await serviceModule.createVaultToken(requestObj);

            expect(callPaydock).toHaveBeenCalledWith('/v1/vault/payment_sources/', data, 'POST');
            expect(result.status).toBe('Success');
            expect(result.token).toBe('vault-token-123');
        });

        test('should return failure when the vault token creation fails', async () => {
            callPaydock.mockResolvedValue({
                response: {
                    status: 400,
                    error: {message: 'Vault token creation failed'},
                },
            });

            const data = {card_number: '4111111111111111', cvv: '123', expire_month: '12', expire_year: '2025'};
            const requestObj = {
                data,
                userId: 'user-123',
                saveCard: true,
                type: 'card',
                configurations: {credentials_type: 'credentials', credentials_secret_key: 'secret-key-123'},
            };

            const result = await serviceModule.createVaultToken(requestObj);

            expect(callPaydock).toHaveBeenCalledWith('/v1/vault/payment_sources/', data, 'POST');
            expect(result.status).toBe('Failure');
            expect(result.message).toBe('Vault token creation failed');
        });
    });

    describe('createStandalone3dsToken', () => {
        test('should create a standalone 3ds token successfully', async () => {
            const mockResponse = {
                response: {
                    status: 201,
                    resource: {
                        data: {
                            _3ds: {token: '3ds-token-123'},
                        },
                    },
                },
            };

            callPaydock.mockResolvedValue(mockResponse);

            const data = {amount: 10000, currency: 'AUD'};
            const result = await serviceModule.createStandalone3dsToken(data);

            expect(callPaydock).toHaveBeenCalledWith('/v1/charges/standalone-3ds', data, 'POST');
            expect(result.status).toBe('Success');
            expect(result.token).toBe('3ds-token-123');
        });

        test('should return failure when 3ds token creation fails', async () => {
            const mockResponse = {
                response: {
                    status: 400,
                    error: {message: '3ds token creation failed'},
                },
            };

            callPaydock.mockResolvedValue(mockResponse);

            const data = {amount: 10000, currency: 'AUD'};
            const result = await serviceModule.createStandalone3dsToken(data);

            expect(callPaydock).toHaveBeenCalledWith('/v1/charges/standalone-3ds', data, 'POST');
            expect(result.status).toBe('Failure');
            expect(result.message).toBe('3ds token creation failed');
        });
    });

    describe('updatePaydockStatus', () => {
        test('should return success when the status is updated successfully', async () => {
            const mockResponse = {
                response: {
                    status: 200,
                    resource: {
                        data: {_id: 'charge-456'},
                    },
                },
            };

            callPaydock.mockResolvedValue(mockResponse);

            const data = {status: 'paid'};
            const result = await serviceModule.updatePaydockStatus('/v1/charges/update', 'POST', data);

            expect(callPaydock).toHaveBeenCalledWith('/v1/charges/update', data, 'POST');
            expect(result.status).toBe('Success');
            expect(result.chargeId).toBe('charge-456');
        });

        test('should return failure when the status update fails', async () => {
            const mockResponse = {
                response: {
                    status: 500,
                    error: {message: 'Status update failed'},
                },
            };

            callPaydock.mockResolvedValue(mockResponse);

            const data = {status: 'paid'};
            const result = await serviceModule.updatePaydockStatus('/v1/charges/update', 'POST', data);

            expect(callPaydock).toHaveBeenCalledWith('/v1/charges/update', data, 'POST');
            expect(result.status).toBe('Failure');
            expect(result.message).toBe('Status update failed');
        });
    });


    describe('makePayment', () => {
        test('should handle unknown payment type gracefully', async () => {
            makePaymentRequestObj.PaydockPaymentType = 'unknown'

            const response = await serviceModule.makePayment(makePaymentRequestObj, paymentObject, loggerContext);

            expect(response.status).toBe('Error');
            expect(response.message).toBe('Unknown payment type: unknown');
        });

        test('should handle a successful card payment', async () => {
            makePaymentRequestObj.PaydockPaymentType = 'card'
            makePaymentRequestObj.VaultToken = '';
            makePaymentRequestObj.CommerceToolsUserId = 'not authorized';
            makePaymentRequestObj.SaveCard = false;

            updateOrderPaymentState.mockResolvedValue(true);
            callPaydock.mockResolvedValue({
                response: {
                    status: 201,
                    resource: {data: {vault_token: 'vault-token-123', _id: 'charge-456'}},
                },
            });

            mockCtpClient.fetchByKey.mockResolvedValue({
                body: {
                    version: 1,
                    custom: {
                        fields: {
                            userVaultTokens: JSON.stringify({}),
                        },
                    },
                },
            });

            mockCtpClient.update.mockResolvedValue({
                body: {version: 2},
            });

            const response = await serviceModule.makePayment(makePaymentRequestObj, paymentObject, loggerContext);

            expect(callPaydock).toHaveBeenCalled();
            expect(response.status).toBe('Success');
            expect(response.chargeId).toBe('charge-456');
        });

        test('should handle payment failure', async () => {
            makePaymentRequestObj.CommerceToolsUserId = 'not authorized';
            makePaymentRequestObj.VaultToken = '';

            // Mock the response from callPaydock
            callPaydock.mockResolvedValue({
                response: {
                    status: 400,
                    error: {message: 'Error creating vault token'},
                },
            });
            updateOrderPaymentState.mockResolvedValue(true);

            // Mock fetchByKey and update to return expected values
            mockCtpClient.fetchByKey.mockResolvedValue({
                body: {
                    version: 1,
                    custom: {
                        fields: {
                            userVaultTokens: JSON.stringify({}),
                        },
                    },
                },
            });

            mockCtpClient.update.mockResolvedValue({
                statusCode: 200, // Returning a proper statusCode to avoid the error
                body: {version: 2},
            });

            const response = await serviceModule.makePayment(makePaymentRequestObj, paymentObject, loggerContext);

            expect(callPaydock).toHaveBeenCalled();
            expect(response.status).toBe('Failure');
        });

        test('should return failure for APM flow when charge creation fails', async () => {
            makePaymentRequestObj.VaultToken = '';
            makePaymentRequestObj.CommerceToolsUserId = 'not authorized';
            makePaymentRequestObj.PaydockPaymentType = 'Zippay';

            // Mock the response from callPaydock to simulate failure in APM flow
            callPaydock.mockResolvedValue({
                response: {
                    status: 400,
                    error: {message: 'Charge creation failed'},
                },
            });
            updateOrderPaymentState.mockResolvedValue(true);

            const response = await serviceModule.makePayment(makePaymentRequestObj, paymentObject, loggerContext);

            expect(callPaydock).toHaveBeenCalled();
            expect(response.status).toBe('Failure');
        });

        test('should return success for APM flow when charge creation is successful', async () => {
            makePaymentRequestObj.VaultToken = '';
            makePaymentRequestObj.CommerceToolsUserId = 'not authorized';
            makePaymentRequestObj.PaydockPaymentType = 'Zippay';

            // Mock the response from callPaydock to simulate success in APM flow
            callPaydock.mockResolvedValue({
                response: {
                    status: 201,
                    resource: {
                        data: {_id: 'charge-456'},
                    },
                },
            });
            updateOrderPaymentState.mockResolvedValue(true);

            const response = await serviceModule.makePayment(makePaymentRequestObj, paymentObject, loggerContext);

            expect(callPaydock).toHaveBeenCalled();
            expect(response.status).toBe('Success');
            expect(response.chargeId).toBe('charge-456');
        });
    });
    test('should use existing VaultToken and not create a new one', async () => {
        callPaydock.mockResolvedValue({
            response: {
                status: 201,
                resource: {data: {vault_token: 'existing-vault-token', _id: 'charge-456'}},
            },
        });

        const response = await serviceModule.makePayment(makePaymentRequestObj, paymentObject, loggerContext);

        expect(response.status).toBe('Success');
        expect(response.chargeId).toBe('charge-456');
    });
    test('should not save the card if CommerceToolsUserId is "not authorized"', async () => {
        makePaymentRequestObj.VaultToken = '';
        makePaymentRequestObj.CommerceToolsUserId = 'not authorized';

        callPaydock.mockResolvedValue({
            response: {
                status: 201,
                resource: {data: {vault_token: 'vault-token-123', _id: 'charge-456'}},
            },
        });

        const response = await serviceModule.makePayment(makePaymentRequestObj, paymentObject, loggerContext);

        expect(callPaydock).toHaveBeenCalled();
        expect(response.status).toBe('Success');
        expect(response.chargeId).toBe('charge-456');
    });
    test('should create a new customer if no existing customer found by VaultToken', async () => {
        makePaymentRequestObj.VaultToken = 'new-vault-token';
        makePaymentRequestObj.CommerceToolsUserId = 'user-123';
        makePaymentRequestObj.PaydockPaymentType = 'card';
        mockCtpClient.fetchById.mockResolvedValue({
            body: {
                customerObject
            }
        });
        mockCtpClient.fetchByKey.mockResolvedValue({
            body: {
                version: 1,
                custom: {
                    fields: {
                        userVaultTokens: JSON.stringify({}),
                    },
                },
            },
        });

        callPaydock.mockResolvedValue({
            response: {
                status: 201,
                resource: {data: {vault_token: 'vault-token-123', _id: 'charge-456'}},
            },
        });

        const response = await serviceModule.makePayment(makePaymentRequestObj, paymentObject, loggerContext);

        expect(callPaydock).toHaveBeenCalled();
        expect(response.status).toBe('Success');
        expect(response.chargeId).toBe('charge-456');
    });
    test('should handle failure in updating order payment state', async () => {
        makePaymentRequestObj.VaultToken = 'new-vault-token';
        makePaymentRequestObj.CommerceToolsUserId = 'user-123';
        makePaymentRequestObj.PaydockPaymentType = 'card';

        callPaydock.mockResolvedValue({
            response: {
                status: 201,
                resource: {data: {vault_token: 'vault-token-123', _id: 'charge-456'}},
            },
        });

        updateOrderPaymentState.mockResolvedValue(false);

        const response = await serviceModule.makePayment(makePaymentRequestObj, paymentObject, loggerContext);

        expect(callPaydock).toHaveBeenCalled();
        expect(response.status).toBe('Success');
        expect(response.chargeId).toBe('charge-456');
    });
    test('should handle Zippay payment type in handlePaymentType', async () => {
        const input = {
            orderId: 'order-123',
            PaydockTransactionId: 'charge-123',
            PaydockPaymentType: 'Zippay',
            amount: {value: 10000, currency: 'AUD'},
            CommerceToolsUserId: 'user-123',
            SaveCard: false,
        };


        callPaydock.mockResolvedValue({
            response: {
                status: 201,
                resource: {data: {_id: 'charge-456'}},
            },
        });

        const response = await serviceModule.makePayment(input, paymentObject, loggerContext);

        expect(response.status).toBe('Success');
        expect(response.chargeId).toBe('charge-456');
    });

    test('should handle errors in cardFraud3DsCharge', async () => {
        const input = {
            orderId: 'order-123',
            PaydockTransactionId: 'charge-123',
            amount: 10000,
            CommerceToolsUserId: 'user-123',
            billing_first_name: 'John',
            billing_last_name: 'Doe',
            billing_email: 'john.doe@example.com',
            billing_phone: '0412345678',
        };

        callPaydock.mockResolvedValue({
            response: {
                status: 400,
                error: {message: 'Fraud check failed'},
            },
        });

        const result = await serviceModule.makePayment(input, paymentObject, loggerContext);
        expect(result.status).toBe('Error');
    });

    test('should create a charge with standalone fraud check', async () => {
        const data = {
            amount: 10000,
            currency: 'AUD',
            customer: {
                first_name: 'John',
                last_name: 'Doe',
                email: 'john.doe@example.com',
                phone: '0412345678',
                payment_source: {
                    vault_token: 'vault-token-123',
                    address_line2: 'test'
                },
            },
        };

        callPaydock.mockResolvedValue({
            response: {
                status: 201,
                resource: {data: {_id: 'charge-456'}},
            },
        });


        const result = await serviceModule.createCharge(data, {action: 'standalone-fraud'});

        expect(result.status).toBe('Success');
        expect(result.chargeId).toBe('charge-456');
        expect(callPaydock).toHaveBeenCalledWith('/v1/charges/fraud', data, 'POST');
    });
    test('should save user token in saveUserToken', async () => {

        mockCtpClient.fetchByKey.mockResolvedValue({
            body: {
                version: 1,
                custom: {
                    fields: {
                        userVaultTokens: JSON.stringify({}),
                    },
                },
            },
        });

        mockCtpClient.update.mockResolvedValue({
            body: {version: 2},
        });

        const result = await serviceModule.makePayment({
            CommerceToolsUserId: 'user-123',
            VaultToken: 'vault-token-123',
            SaveCard: true,
            PaydockPaymentType: 'card',
            amount: {value: 10000, currency: 'AUD'},
        }, paymentObject, loggerContext);

        expect(result.status).toBe('Success');
    });

    test('should return failure when createStandalone3dsToken fails', async () => {
        callPaydock.mockResolvedValue({
            response: {
                status: 400,
                error: {message: '3DS token creation failed'},
            },
        });

        const data = {amount: 10000, currency: 'AUD'};
        const result = await serviceModule.createStandalone3dsToken(data);

        expect(result.status).toBe('Failure');
        expect(result.message).toBe('3DS token creation failed');
    });

    test('should update payment status successfully', async () => {
        callPaydock.mockResolvedValue({
            response: {
                status: 200,
                resource: {data: {_id: 'charge-456'}},
            },
        });

        const data = {status: 'paid'};
        const result = await serviceModule.updatePaydockStatus('/v1/charges/update', 'POST', data);

        expect(result.status).toBe('Success');
        expect(result.chargeId).toBe('charge-456');
    });
    test('should return failure when updatePaydockStatus fails', async () => {
        callPaydock.mockResolvedValue({
            response: {
                status: 500,
                error: {message: 'Status update failed'},
            },
        });

        const data = {status: 'paid'};
        const result = await serviceModule.updatePaydockStatus('/v1/charges/update', 'POST', data);

        expect(result.status).toBe('Failure');
        expect(result.message).toBe('Status update failed');
    });

    test('should handle payment with In-built 3DS and In-built Fraud through makePayment', async () => {


        makePaymentRequestObj.VaultToken = 'new-vault-token';
        makePaymentRequestObj.CommerceToolsUserId = 'user-123';
        makePaymentRequestObj.PaydockPaymentType = 'card';

        const configurations = {
            card_use_on_checkout: 'Yes',
            card_3ds: 'In-built 3DS',
            card_fraud: 'In-built Fraud',
            card_3ds_flow: 'With OTT',
            card_direct_charge: 'Enable',
            card_gateway_id: 'gateway-id-123',
            card_3ds_service_id: '3ds-service-id',
            card_fraud_service_id: 'fraud-service-id'
        };

        config.getPaydockConfig.mockResolvedValue(configurations);

        callPaydock.mockResolvedValue({
            response: {
                status: 201,
                resource: {data: {_id: 'charge-456'}},
            },
        });

        const response = await serviceModule.makePayment(makePaymentRequestObj,paymentObject, loggerContext);

        expect(response.status).toBe('Success');
        expect(response.chargeId).toBe('charge-456');
        expect(callPaydock).toHaveBeenCalledWith(expect.any(String), expect.any(Object), 'POST');
    });

    test('should handle payment with 3DS and Fraud through makePayment', async () => {
        makePaymentRequestObj.VaultToken = 'new-vault-token';
        makePaymentRequestObj.CommerceToolsUserId = 'user-123';
        makePaymentRequestObj.PaydockPaymentType = 'card';

        const configurations = {
            card_use_on_checkout: 'Yes',
            card_3ds: 'Standalone 3DS',
            card_fraud: 'In-built Fraud',
            card_direct_charge: 'Enable',
            card_card_method_save: 'Customer with Gateway ID',
            card_gateway_id: 'gateway-id-123'
        };

        config.getPaydockConfig.mockResolvedValue(configurations);

        callPaydock.mockResolvedValue({
            response: {
                status: 201,
                resource: {data: {_id: 'charge-456'}},
            },
        });

        const response = await serviceModule.makePayment(makePaymentRequestObj, paymentObject, loggerContext);

        expect(response.status).toBe('Success');
        expect(response.chargeId).toBe('charge-456');
        expect(callPaydock).toHaveBeenCalledWith(expect.any(String), expect.any(Object), 'POST');
    });

    test('should handle payment with standalone 3DS and Fraud through makePayment', async () => {
        makePaymentRequestObj.VaultToken = 'new-vault-token';
        makePaymentRequestObj.CommerceToolsUserId = 'user-123';
        makePaymentRequestObj.PaydockPaymentType = 'card';

        const configurations = {
            card_use_on_checkout: 'Yes',
            card_3ds: 'Standalone 3DS',
            card_fraud: 'Standalone Fraud',
            card_direct_charge: 'Enable',
            card_card_save: false,
            card_card_method_save: 'Customer with Gateway ID',
            card_gateway_id: 'gateway-id-123'
        };

        config.getPaydockConfig.mockResolvedValue(configurations);

        callPaydock.mockResolvedValue({
            response: {
                status: 201,
                resource: {data: {_id: 'charge-456'}},
            },
        });
        updateOrderPaymentState.mockResolvedValue(true);
        setItem.mockResolvedValue(null);
        const response = await serviceModule.makePayment(makePaymentRequestObj, paymentObject, loggerContext);

        expect(response.status).toBe('Success');
        expect(response.chargeId).toBe('charge-456');
        expect(callPaydock).toHaveBeenCalledWith(expect.any(String), expect.any(Object), 'POST');
    });

    test('should handle payment with standalone Fraud and In-built 3DS through makePayment', async () => {
        makePaymentRequestObj.VaultToken = 'new-vault-token';
        makePaymentRequestObj.CommerceToolsUserId = 'user-123';
        makePaymentRequestObj.PaydockPaymentType = 'card';

        const configurations = {
            card_use_on_checkout: 'Yes',
            card_3ds: 'In-built 3DS',
            card_fraud: 'Standalone Fraud',
            card_direct_charge: 'Enable',
            card_gateway_id: 'gateway-id-123'
        };

        config.getPaydockConfig.mockResolvedValue(configurations);
        setItem.mockResolvedValue(null);

        callPaydock.mockResolvedValue({
            response: {
                status: 201,
                resource: {data: {_id: 'charge-456'}},
            },
        });
        updateOrderPaymentState.mockResolvedValue(true);

        const response = await serviceModule.makePayment(makePaymentRequestObj, paymentObject, loggerContext);

        expect(response.status).toBe('Success');
        expect(response.chargeId).toBe('charge-456');
        expect(callPaydock).toHaveBeenCalledWith(expect.any(String), expect.any(Object), 'POST');
    });
    test('should handle payment with In-built Fraud and standalone 3DS through makePayment', async () => {
        makePaymentRequestObj.VaultToken = 'new-vault-token';
        makePaymentRequestObj.CommerceToolsUserId = 'user-123';
        makePaymentRequestObj.PaydockPaymentType = 'card';

        const configurations = {
            card_use_on_checkout: 'Yes',
            card_3ds: 'Standalone 3DS',
            card_fraud: 'In-built Fraud',
            card_direct_charge: 'Enable',
            card_gateway_id: 'gateway-id-123'
        };

        config.getPaydockConfig.mockResolvedValue(configurations);

        callPaydock.mockResolvedValue({
            response: {
                status: 201,
                resource: {data: {_id: 'charge-456'}},
            },
        });

        const response = await serviceModule.makePayment(makePaymentRequestObj, paymentObject, loggerContext);

        expect(response.status).toBe('Success');
        expect(response.chargeId).toBe('charge-456');
        expect(callPaydock).toHaveBeenCalledWith(expect.any(String), expect.any(Object), 'POST');
    });
    test('should handle payment with In-built 3DS through makePayment', async () => {
        makePaymentRequestObj.VaultToken = 'new-vault-token';
        makePaymentRequestObj.CommerceToolsUserId = 'user-123';
        makePaymentRequestObj.PaydockPaymentType = 'card';

        const configurations = {
            card_use_on_checkout: 'Yes',
            card_3ds: 'In-built 3DS',
            card_direct_charge: 'Enable',
            card_gateway_id: 'gateway-id-123',
            card_3ds_service_id: '3ds-service-id',
        };

        config.getPaydockConfig.mockResolvedValue(configurations);

        callPaydock.mockResolvedValue({
            response: {
                status: 201,
                resource: {data: {_id: 'charge-456'}},
            },
        });

        const response = await serviceModule.makePayment(makePaymentRequestObj, paymentObject, loggerContext);

        expect(response.status).toBe('Success');
        expect(response.chargeId).toBe('charge-456');
        expect(callPaydock).toHaveBeenCalledWith(expect.any(String), expect.any(Object), 'POST');
    });
    test('should handle payment with Fraud protection through makePayment', async () => {
        makePaymentRequestObj.VaultToken = 'new-vault-token';
        makePaymentRequestObj.CommerceToolsUserId = 'user-123';
        makePaymentRequestObj.PaydockPaymentType = 'card';

        const configurations = {
            card_use_on_checkout: 'Yes',
            card_fraud: 'In-built Fraud',
            card_direct_charge: 'Enable',
            card_gateway_id: 'gateway-id-123',
            card_fraud_service_id: 'fraud-service-id',
        };

        config.getPaydockConfig.mockResolvedValue(configurations);

        callPaydock.mockResolvedValue({
            response: {
                status: 201,
                resource: {data: {_id: 'charge-456'}},
            },
        });

        const response = await serviceModule.makePayment(makePaymentRequestObj, paymentObject, loggerContext);

        expect(response.status).toBe('Success');
        expect(response.chargeId).toBe('charge-456');
        expect(callPaydock).toHaveBeenCalledWith(expect.any(String), expect.any(Object), 'POST');
    });
    test('should handle payment with Standalone Fraud protection through makePayment', async () => {
        makePaymentRequestObj.VaultToken = 'new-vault-token';
        makePaymentRequestObj.CommerceToolsUserId = 'user-123';
        makePaymentRequestObj.PaydockPaymentType = 'card';

        const configurations = {
            card_use_on_checkout: 'Yes',
            card_fraud: 'Standalone Fraud',
            card_direct_charge: 'Enable',
            card_gateway_id: 'gateway-id-123',
            card_fraud_service_id: 'fraud-service-id',
        };

        config.getPaydockConfig.mockResolvedValue(configurations);

        callPaydock.mockResolvedValue({
            response: {
                status: 201,
                resource: {data: {_id: 'charge-456'}},
            },
        });

        const response = await serviceModule.makePayment(makePaymentRequestObj, paymentObject, loggerContext);

        expect(response.status).toBe('Success');
        expect(response.chargeId).toBe('charge-456');
        expect(callPaydock).toHaveBeenCalledWith(expect.any(String), expect.any(Object), 'POST');
    });
    test('should create a customer and save the vault token', async () => {
        makePaymentRequestObj.VaultToken = 'new-vault-token';
        makePaymentRequestObj.PaydockTransactionId = 'charge-123';
        makePaymentRequestObj.CommerceToolsUserId = 'user-123';
        makePaymentRequestObj.PaydockPaymentType = 'card';
        makePaymentRequestObj.SaveCard = true;

        const configurations = {
            card_use_on_checkout: 'Yes',
            card_card_save: 'Enable',
            card_card_method_save: 'Customer with Gateway ID',
            card_gateway_id: 'gateway-id-123',
        };

        config.getPaydockConfig.mockResolvedValue(configurations);

        callPaydock.mockResolvedValueOnce({
            response: {
                status: 201,
                resource: {data: {_id: 'customer-123'}},
            },
        }).mockResolvedValueOnce({
            response: {
                status: 201,
                resource: {data: {vault_token: 'vault-token-123'}},
            },
        });

        const response = await serviceModule.makePayment(makePaymentRequestObj, paymentObject, loggerContext);

        expect(response.status).toBe('Success');
        expect(response.chargeId).toBe('charge-456');
        expect(callPaydock).toHaveBeenCalledTimes(3);
        expect(callPaydock).toHaveBeenCalledWith(expect.stringContaining('/v1/customers'), expect.any(Object), 'POST');
        expect(callPaydock).toHaveBeenCalledWith(expect.stringContaining('/v1/vault-tokens'), expect.any(Object), 'GET');
    });

});
