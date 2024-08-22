import {expect, test, jest} from '@jest/globals';

import { preUndeployment } from '../../src/pre-undeployment.js';
import { cleanupNotificationResources } from '../../src/setup';
import { serializeError } from 'serialize-error';

jest.mock('../../src/setup');
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

describe('preUndeployment', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('should call cleanupNotificationResources without throwing an error', async () => {
        cleanupNotificationResources.mockResolvedValue();
        await expect(preUndeployment()).resolves.not.toThrow();
        expect(cleanupNotificationResources).toHaveBeenCalled();
    });

    test('should throw an error if cleanupNotificationResources fails', async () => {
        const mockError = new Error('Cleanup failed');
        const serializedError = { message: 'Cleanup failed', stack: 'stack trace' };
        cleanupNotificationResources.mockRejectedValue(mockError);
        serializeError.mockReturnValue(serializedError);
        await expect(preUndeployment()).rejects.toThrow(`Error: ${JSON.stringify(serializedError)}`);
        expect(cleanupNotificationResources).toHaveBeenCalled();
        expect(serializeError).toHaveBeenCalledWith(mockError);
    });
});
