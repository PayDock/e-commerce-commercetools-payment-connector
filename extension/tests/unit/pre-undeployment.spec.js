import {expect, test, jest} from '@jest/globals';

import { preUndeployment } from '../../src/pre-undeployment.js';
import { cleanupExtensionResources } from '../../src/setup';
import { serializeError } from 'serialize-error';

jest.mock('../../src/setup');
jest.mock('serialize-error');

jest.mock('../../src/config/config-loader.js', () => {
    const originalModule = jest.requireActual('../../src/config/config-loader.js');
    const loaderConfigResult = jest.requireActual('../../test-data/extentionConfig.json')

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
describe('preUndeployment', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('should call cleanupExtensionResources without throwing an error', async () => {
        cleanupExtensionResources.mockResolvedValue();
        await expect(preUndeployment()).resolves.not.toThrow();
        expect(cleanupExtensionResources).toHaveBeenCalled();
    });

    test('should throw an error if cleanupExtensionResources fails', async () => {
        const mockError = new Error('Cleanup failed');
        const serializedError = { message: 'Cleanup failed', stack: 'stack trace' };
        cleanupExtensionResources.mockRejectedValue(mockError);
        serializeError.mockReturnValue(serializedError);
        await expect(preUndeployment()).rejects.toThrow(`Error: ${JSON.stringify(serializedError)}`);
        expect(cleanupExtensionResources).toHaveBeenCalled();
        expect(serializeError).toHaveBeenCalledWith(mockError);
    });
});
