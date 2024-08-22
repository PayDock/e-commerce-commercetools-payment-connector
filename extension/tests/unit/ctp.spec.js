import { expect,  jest } from '@jest/globals';
import ctpModule from '../../src/ctp';
import { createClient } from '@commercetools/sdk-client';
import { createAuthMiddlewareForClientCredentialsFlow } from '@commercetools/sdk-middleware-auth';
import { createUserAgentMiddleware } from '@commercetools/sdk-middleware-user-agent';
import { createHttpMiddleware } from '@commercetools/sdk-middleware-http';
import { createQueueMiddleware } from '@commercetools/sdk-middleware-queue';
import lodash from 'lodash';

jest.mock('@commercetools/sdk-middleware-user-agent');
jest.mock('@commercetools/sdk-client');
jest.mock('@commercetools/sdk-middleware-auth');
jest.mock('@commercetools/sdk-middleware-http');
jest.mock('@commercetools/sdk-middleware-queue');
jest.mock('@commercetools/api-request-builder');
jest.mock('lodash', () => ({
    merge: jest.fn()
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

describe('ctp.js', () => {
    const mockConfig = {
        clientId: 'mockClientId',
        clientSecret: 'mockClientSecret',
        projectKey: 'mockProjectKey',
        apiUrl: 'https://api.sphere.io',
        authUrl: 'https://auth.sphere.io',
        concurrency: 10,
    };

    const mockClient = {
        execute: jest.fn(),
        fetch: jest.fn(),
        create: jest.fn(),
        delete: jest.fn(),
        deleteByContainerAndKey: jest.fn(),
        update: jest.fn(),
        fetchById: jest.fn(),
        fetchByKey: jest.fn(),
        fetchOrderByNymber: jest.fn()
    };


    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('should create CTP client with correct middlewares', async () => {
        createClient.mockReturnValue(mockClient);
        createAuthMiddlewareForClientCredentialsFlow.mockReturnValue('authMiddleware');
        createUserAgentMiddleware.mockReturnValue('userAgentMiddleware');
        createHttpMiddleware.mockReturnValue('httpMiddleware');
        createQueueMiddleware.mockReturnValue('queueMiddleware');

        const client = await ctpModule.get(mockConfig);

        expect(createAuthMiddlewareForClientCredentialsFlow).toHaveBeenCalledWith({
            host: mockConfig.authUrl,
            projectKey: mockConfig.projectKey,
            credentials: {
                clientId: mockConfig.clientId,
                clientSecret: mockConfig.clientSecret,
            },
            fetch: expect.any(Function),
            tokenCache: expect.any(Object),
        });

        expect(createUserAgentMiddleware).toHaveBeenCalledWith(expect.any(Object));
        expect(createHttpMiddleware).toHaveBeenCalledWith({
            maskSensitiveHeaderData: true,
            host: mockConfig.apiUrl,
            enableRetry: true,
            disableCache: true,
            fetch: expect.any(Function),
        });

        expect(createQueueMiddleware).toHaveBeenCalledWith({
            concurrency: mockConfig.concurrency,
        });

        expect(createClient).toHaveBeenCalledWith({
            middlewares: [
                'authMiddleware',
                'userAgentMiddleware',
                'httpMiddleware',
                'queueMiddleware',
            ],
        });

        expect(lodash.merge).toHaveBeenCalledWith(expect.any(Object), mockClient);
    });

    test('should execute fetch request correctly', async () => {
        const mockClient = {
            execute: jest.fn().mockResolvedValue({ body: 'result' }),
        };

        createClient.mockReturnValue(mockClient);

        const customMethods = {
            fetch: jest.fn(async (uri) => {
                return mockClient.execute({
                    uri: uri.build(),
                    method: 'GET',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                });
            }),
        };

        lodash.merge.mockImplementation((client, methods) => {
            return {
                ...client,
                ...methods,
            };
        });

        const client = await ctpModule.get(mockConfig);
        const uri = { build: jest.fn().mockReturnValue('mockUri') };

        const result = await client.fetch(uri);

        expect(uri.build).toHaveBeenCalled();
        expect(mockClient.execute).toHaveBeenCalledWith({
            uri: 'mockUri',
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        });
        expect(result).toEqual({ body: 'result' });
    });

    test('should execute create request correctly', async () => {
        const mockClient = {
            execute: jest.fn().mockResolvedValue({ body: 'created' })
        };
        createClient.mockReturnValue(mockClient);

        const client = await ctpModule.get(mockConfig);
        const uri = { build: jest.fn().mockReturnValue('mockUri') };
        const body = { some: 'data' };

        const result = await client.create(uri, body);

        expect(uri.build).toHaveBeenCalled();
        expect(mockClient.execute).toHaveBeenCalledWith({
            uri: 'mockUri',
            method: 'POST',
            body: body,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        });
        expect(result).toEqual({ body: 'created' });
    });

    test('should execute delete request correctly', async () => {
        const mockClient = {
            execute: jest.fn().mockResolvedValue({ body: 'deleted' })
        };
        createClient.mockReturnValue(mockClient);

        const client = await ctpModule.get(mockConfig);
        const uri = {
            byId: jest.fn().mockReturnValue({
                withVersion: jest.fn().mockReturnValue({
                    build: jest.fn().mockReturnValue('mockUri')
                })
            })
        };

        const result = await client.delete(uri, 'mockId', 1);

        expect(uri.byId).toHaveBeenCalledWith('mockId');
        expect(uri.byId().withVersion).toHaveBeenCalledWith(1);
        expect(uri.byId().withVersion().build).toHaveBeenCalled();
        expect(mockClient.execute).toHaveBeenCalledWith({
            uri: 'mockUri',
            method: 'DELETE',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        });
        expect(result).toEqual({ body: 'deleted' });
    });

    test('should execute deleteByContainerAndKey request correctly', async () => {
        const mockClient = {
            execute: jest.fn().mockResolvedValue({ body: 'deleted' })
        };
        createClient.mockReturnValue(mockClient);

        const client = await ctpModule.get(mockConfig);
        const uri = {
            byContainerAndKey: jest.fn().mockReturnValue({
                build: jest.fn().mockReturnValue('mockUri')
            })
        };

        const result = await client.deleteByContainerAndKey(uri, 'mockContainer', 'mockKey');

        expect(uri.byContainerAndKey).toHaveBeenCalledWith('mockContainer', 'mockKey');
        expect(uri.byContainerAndKey().build).toHaveBeenCalled();
        expect(mockClient.execute).toHaveBeenCalledWith({
            uri: 'mockUri',
            method: 'DELETE',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        });
        expect(result).toEqual({ body: 'deleted' });
    });

    test('should execute update request correctly', async () => {
        const mockClient = {
            execute: jest.fn().mockResolvedValue({ body: 'updated' })
        };
        createClient.mockReturnValue(mockClient);

        const client = await ctpModule.get(mockConfig);
        const uri = {
            byId: jest.fn().mockReturnValue({
                build: jest.fn().mockReturnValue('mockUri')
            })
        };
        const actions = [{ action: 'changeName', name: 'new name' }];

        const result = await client.update(uri, 'mockId', 1, actions);

        expect(uri.byId).toHaveBeenCalledWith('mockId');
        expect(uri.byId().build).toHaveBeenCalled();
        expect(mockClient.execute).toHaveBeenCalledWith({
            uri: 'mockUri',
            method: 'POST',
            body: {
                version: 1,
                actions: actions,
            },
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        });
        expect(result).toEqual({ body: 'updated' });
    });

    test('should execute fetchById request correctly', async () => {
        const mockClient = {
            execute: jest.fn().mockResolvedValue({ body: 'fetched by id' })
        };
        createClient.mockReturnValue(mockClient);

        const client = await ctpModule.get(mockConfig);
        const uri = {
            byId: jest.fn().mockReturnValue({
                build: jest.fn().mockReturnValue('mockUri')
            })
        };

        const result = await client.fetchById(uri, 'mockId');

        expect(uri.byId).toHaveBeenCalledWith('mockId');
        expect(uri.byId().build).toHaveBeenCalled();
        expect(mockClient.execute).toHaveBeenCalledWith({
            uri: 'mockUri',
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        });
        expect(result).toEqual({ body: 'fetched by id' });
    });
    test('should execute fetchByKey request correctly', async () => {
        const mockClient = {
            execute: jest.fn().mockResolvedValue({ body: 'fetched by key' })
        };
        createClient.mockReturnValue(mockClient);

        const client = await ctpModule.get(mockConfig);
        const uri = {
            byKey: jest.fn().mockReturnValue({
                build: jest.fn().mockReturnValue('mockUri')
            })
        };

        const result = await client.fetchByKey(uri, 'mockKey');

        expect(uri.byKey).toHaveBeenCalledWith('mockKey');
        expect(uri.byKey().build).toHaveBeenCalled();
        expect(mockClient.execute).toHaveBeenCalledWith({
            uri: 'mockUri',
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        });
        expect(result).toEqual({ body: 'fetched by key' });
    });
    test('should execute fetchOrderByNymber request correctly', async () => {
        const mockClient = {
            execute: jest.fn().mockResolvedValue({ body: 'fetched by order number' })
        };
        createClient.mockReturnValue(mockClient);

        const client = await ctpModule.get(mockConfig);
        const uri = {
            byKey: jest.fn().mockReturnValue({
                build: jest.fn().mockReturnValue('mockUri/key')
            })
        };

        const result = await client.fetchOrderByNymber(uri, 'mockOrderNumber');

        expect(uri.byKey).toHaveBeenCalledWith('mockOrderNumber');
        expect(uri.byKey().build).toHaveBeenCalled();
        expect(mockClient.execute).toHaveBeenCalledWith({
            uri: 'mockUri/order-number',
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        });
        expect(result).toEqual({ body: 'fetched by order number' });
    });
    test('should execute fetchOrderByNymber request correctly', async () => {
        const mockClient = {
            execute: jest.fn().mockResolvedValue({ body: 'fetched by order number' })
        };
        createClient.mockReturnValue(mockClient);

        const client = await ctpModule.get(mockConfig);
        const uri = {
            byKey: jest.fn().mockReturnValue({
                build: jest.fn().mockReturnValue('mockUri/key')
            })
        };

        const result = await client.fetchOrderByNymber(uri, 'mockOrderNumber');

        expect(uri.byKey).toHaveBeenCalledWith('mockOrderNumber');
        expect(uri.byKey().build).toHaveBeenCalled();
        expect(mockClient.execute).toHaveBeenCalledWith({
            uri: 'mockUri/order-number',
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        });
        expect(result).toEqual({ body: 'fetched by order number' });
    });

});
