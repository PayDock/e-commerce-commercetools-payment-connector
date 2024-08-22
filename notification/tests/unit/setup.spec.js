import {jest, expect} from "@jest/globals";

import { setupNotificationResources, cleanupNotificationResources } from '../../src/setup.js';
import config from '../../src/config/config.js';
import ctpClientBuilder from '../../src/utils/ctp.js';
import { serializeError } from "serialize-error";

jest.mock('../../src/config/config.js');
jest.mock('../../src/utils/ctp.js');
jest.mock('serialize-error');

jest.mock('../../src/config/config-loader.js', () => {
    const originalModule = jest.requireActual('../../src/config/config-loader.js');
    const loaderConfigResult = jest.requireActual('../../test-data/notificationConfig.json')

    return {
        __esModule: true,
        ...originalModule,
        loadConfig: jest.fn(() => loaderConfigResult),
    };
});
describe('notification.service', () => {
    let mockCtpClient;

    beforeEach(() => {
        jest.clearAllMocks();

        mockCtpClient = {
            deleteByContainerAndKey: jest.fn().mockResolvedValue({}),
            create: jest.fn().mockResolvedValue({}),
            builder: {
                customObjects: {},
            },
        };

        config.getCtpClient.mockResolvedValue(mockCtpClient);
    });

    describe('cleanupNotificationResources', () => {
        test('should call deleteByContainerAndKey with correct parameters', async () => {
            await cleanupNotificationResources();

            expect(config.getCtpClient).toHaveBeenCalled();
            expect(mockCtpClient.deleteByContainerAndKey).toHaveBeenCalledWith(
                mockCtpClient.builder.customObjects,
                'paydock-notification',
                'url'
            );
        });

        test('should throw an error if deleteByContainerAndKey fails', async () => {
            const mockError = new Error('Delete failed');
            mockCtpClient.deleteByContainerAndKey.mockRejectedValue(mockError);

            await expect(cleanupNotificationResources()).rejects.toThrow(
                `Error: ${JSON.stringify(serializeError(mockError))}`
            );
        });
    });

    describe('setupNotificationResources', () => {
        let moduleConfig;

        beforeEach(() => {
            moduleConfig = {
                apiNotificationnBaseUrl: 'http://example.com/notification',
            };
            config.getModuleConfig.mockReturnValue(moduleConfig);
        });

        test('should create custom object notification URL if apiNotificationnBaseUrl is defined', async () => {
            await setupNotificationResources();

            expect(config.getCtpClient).toHaveBeenCalled();
            expect(mockCtpClient.create).toHaveBeenCalledWith(
                mockCtpClient.builder.customObjects,
                {
                    container: 'paydock-notification',
                    key: 'url',
                    value: moduleConfig.apiNotificationnBaseUrl,
                }
            );
        });


        test('should throw an error if createCustomObjectNotificationUrl fails', async () => {
            const mockError = new Error('Create failed');
            mockCtpClient.create.mockRejectedValue(mockError);

            await expect(setupNotificationResources()).rejects.toThrow(
                `Error: ${JSON.stringify(serializeError(mockError))}`
            );
        });
    });
});