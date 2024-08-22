import {jest, expect} from "@jest/globals";
import customObjectsUtils from '../../src/utils/custom-objects-utils.js';
import config from '../../src/config/config.js';

jest.mock('../../src/config/config-loader.js', () => {
    const originalModule = jest.requireActual('../../src/config/config-loader.js');
    const loaderConfigResult = jest.requireActual('../../test-data/notificationConfig.json')

    return {
        __esModule: true,
        ...originalModule,
        loadConfig: jest.fn(() => loaderConfigResult),
    };
});
jest.mock('../../src/config/config.js');

describe('custom-objects-utils', () => {
    let ctpClientMock;

    beforeEach(() => {
        ctpClientMock = {
            builder: {
                customObjects: 'customObjectsEndpoint',
            },
            create: jest.fn(),
            fetchByContainerAndKey: jest.fn(),
            deleteByContainerAndKey: jest.fn(),
        };

        config.getCtpClient.mockResolvedValue(ctpClientMock);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('setItem', () => {
        it('should create a custom object with the correct container, key, and value', async () => {
            const key = 'test-key';
            const value = { test: 'value' };

            await customObjectsUtils.setItem(key, value);

            expect(ctpClientMock.create).toHaveBeenCalledWith(
                'customObjectsEndpoint',
                JSON.stringify({ container: 'paydock-storage', key, value })
            );
        });

        it('should throw an error if creating the custom object fails', async () => {
            ctpClientMock.create.mockRejectedValue(new Error('Failed to create custom object'));

            await expect(customObjectsUtils.setItem('test-key', { test: 'value' }))
                .rejects
                .toThrow('Failed to create custom object');
        });
    });

    describe('getItem', () => {
        it('should return the value of the custom object if it exists', async () => {
            const key = 'test-key';
            const value = { test: 'value' };

            ctpClientMock.fetchByContainerAndKey.mockResolvedValue({ body: { value } });

            const result = await customObjectsUtils.getItem(key);

            expect(ctpClientMock.fetchByContainerAndKey).toHaveBeenCalledWith(
                'customObjectsEndpoint',
                'paydock-storage',
                key
            );
            expect(result).toEqual(value);
        });

        it('should return null if fetching the custom object fails', async () => {
            ctpClientMock.fetchByContainerAndKey.mockRejectedValue(new Error('Failed to fetch custom object'));

            const result = await customObjectsUtils.getItem('non-existent-key');

            expect(result).toBeNull();
        });
    });

    describe('removeItem', () => {
        it('should delete the custom object with the correct container and key', async () => {
            const key = 'test-key';

            await customObjectsUtils.removeItem(key);

            expect(ctpClientMock.deleteByContainerAndKey).toHaveBeenCalledWith(
                'customObjectsEndpoint',
                'paydock-storage',
                key
            );
        });

        it('should throw an error if deleting the custom object fails', async () => {
            ctpClientMock.deleteByContainerAndKey.mockRejectedValue(new Error('Failed to delete custom object'));

            await expect(customObjectsUtils.removeItem('test-key'))
                .rejects
                .toThrow('Failed to delete custom object');
        });
    });
});
