import {jest, expect} from "@jest/globals";

import { setupExtensionResources, cleanupExtensionResources } from '../../src/setup.js';
import config from '../../src/config/config.js';
import ctpClientBuilder from '../../src/ctp.js';
import utils from '../../src/utils.js';
import { serializeError } from "serialize-error";

jest.mock('../../src/config/config.js');
jest.mock('../../src/ctp.js');
jest.mock('../../src/utils.js');
jest.mock('../../src/config/init/resources.js');
jest.mock('../../src/validator/authentication.js');
jest.mock('serialize-error');

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
jest.mock('../../src/config/config-loader.js', () => {
    const originalModule = jest.requireActual('../../src/config/config-loader.js');
    const loaderConfigResult = jest.requireActual('../../test-data/extentionConfig.json')

    return {
        __esModule: true,
        ...originalModule,
        loadConfig: jest.fn(() => loaderConfigResult),
    };
});

describe('cleanupExtensionResources', () => {
    let mockCtpClient;

    beforeEach(() => {
        mockCtpClient = { /* додайте потрібні моки для ctpClient */ };
        config.getExtensionConfig.mockReturnValue({ projectKey: 'testProjectKey' });
        ctpClientBuilder.get.mockResolvedValue(mockCtpClient);
        utils.readAndParseJsonFile.mockResolvedValueOnce({ key: 'api-extension-key' })
        utils.deleteElementByKeyIfExists.mockResolvedValue();
    });

    test('should cleanup extension resources', async () => {
        await cleanupExtensionResources();

        expect(config.getExtensionConfig).toHaveBeenCalled();
        expect(ctpClientBuilder.get).toHaveBeenCalledWith({ projectKey: 'testProjectKey' });
        expect(utils.readAndParseJsonFile).toHaveBeenCalledWith('resources/api-extension.json');
        expect(utils.deleteElementByKeyIfExists).toHaveBeenCalledWith(mockCtpClient, 'api-extension-key');
    });

    test('should throw an error if cleanup fails', async () => {
        const error = new Error('Test error');
        utils.deleteElementByKeyIfExists.mockRejectedValueOnce(error);

        await expect(cleanupExtensionResources()).rejects.toThrow(`Error: ${JSON.stringify(serializeError(error))}`);
    });
});
