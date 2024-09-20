import {expect, jest} from "@jest/globals";
import utils from '../../src/utils.js';
import config from '../../src/config/config.js';

jest.mock('../../src/config/config-loader.js', () => {
    const originalModule = jest.requireActual('../../src/config/config-loader.js');
    const loaderConfigResult = jest.requireActual('../../test-data/extentionConfig.json')

    return {
        __esModule: true,
        ...originalModule,
        loadConfig: jest.fn(() => loaderConfigResult),
    };
});

jest.mock('serialize-error');
jest.mock('node:fs/promises');
jest.mock('url');
jest.mock('path');
jest.mock('../../src/config/config.js');
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
describe('utils.js', () => {
    let mockCtpClient;

    beforeEach(() => {
        jest.clearAllMocks();
        mockCtpClient = {
            create: jest.fn(),
            fetchByKey: jest.fn(),
            delete: jest.fn(),
            fetchById: jest.fn(() => ({
                body: {
                    version: 1
                }
            })),
            builder: {
                customObjects: 'customObjectsEndpoint',
                extensions: 'extensionsEndpoint',
                payments: 'logUrl'
            },
            update: jest.fn()
        };
        config.getCtpClient.mockResolvedValue(mockCtpClient);
    });

    test('addPaydockLog should log data to custom objects', async () => {
        const data = {
            paydockChargeID: 'paydockChargeIdId12334',
            operation: 'test operation',
            responseStatus: 'Success',
            message: 'test message'
        };

        const mockTimestamp = '1970-01-01T00:00:00.000Z';
        jest.spyOn(Date.prototype, 'toISOString').mockReturnValue(mockTimestamp);

        utils.addPaydockLog(data);

        expect(utils.getLogsAction()).toEqual([
            {
                "action": "addInterfaceInteraction",
                "type": {
                    "key": "paydock-payment-log-interaction"
                },
                "fields": {
                    "createdAt": mockTimestamp,
                    "chargeId": data.paydockChargeID,
                    "operation": data.operation,
                    "status": data.status,
                    "message": data.message
                }
            }
        ]);
    });

    test('collectRequestData should collect data from request stream', async () => {
        const mockRequest = {
            on: jest.fn((event, callback) => {
                if (event === 'data') {
                    callback(Buffer.from('{"message": "test data"}'));
                }
                if (event === 'end') {
                    callback();
                }
            }),
        };

        const data = await utils.collectRequestData(mockRequest);
        expect(data).toBe('{"message": "test data"}');
    });

    test('sendResponse should send correct response', () => {
        const mockResponse = {
            writeHead: jest.fn(),
            end: jest.fn(),
        };

        const data = {some: 'data'};
        utils.sendResponse({
            response: mockResponse,
            statusCode: 200,
            headers: {'Content-Type': 'application/json'},
            data,
        });

        expect(mockResponse.writeHead).toHaveBeenCalledWith(200, {'Content-Type': 'application/json'});
        expect(mockResponse.end).toHaveBeenCalledWith(JSON.stringify(data));
    });


    test('deleteElementByKeyIfExists should delete element if exists', async () => {
        const key = 'extension-key';
        const mockBody = {id: 'element-id', version: 1};

        mockCtpClient.fetchByKey.mockResolvedValue({body: mockBody});

        const result = await utils.deleteElementByKeyIfExists(mockCtpClient, key);

        expect(mockCtpClient.fetchByKey).toHaveBeenCalledWith('extensionsEndpoint', key);
        expect(mockCtpClient.delete).toHaveBeenCalledWith('extensionsEndpoint', 'element-id', 1);
        expect(result).toEqual(mockBody);
    });

    test('deleteElementByKeyIfExists should return null if element does not exist', async () => {
        const key = 'non-existent-key';

        mockCtpClient.fetchByKey.mockRejectedValue({statusCode: 404});

        const result = await utils.deleteElementByKeyIfExists(mockCtpClient, key);

        expect(mockCtpClient.fetchByKey).toHaveBeenCalledWith('extensionsEndpoint', key);
        expect(result).toBeNull();
    });

    test('deleteElementByKeyIfExists should throw error if non-404 error occurs', async () => {
        const key = 'extension-key';
        const error = new Error('Some error');
        error.statusCode = 500;

        mockCtpClient.fetchByKey.mockRejectedValue(error);

        await expect(utils.deleteElementByKeyIfExists(mockCtpClient, key)).rejects.toThrow('Some error');
    });
});
