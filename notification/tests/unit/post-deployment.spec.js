import {expect, test, jest} from '@jest/globals';

import { postDeployment } from '../../src/post-deployment.js';
import { setupNotificationResources } from '../../src/setup';
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

describe('postDeployment', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('should call setupNotificationResources without throwing an error', async () => {
        setupNotificationResources.mockResolvedValue(); // Імітуємо успішне виконання

        await expect(postDeployment()).resolves.not.toThrow();

        expect(setupNotificationResources).toHaveBeenCalled();
    });

    test('should throw an error if setupNotificationResources fails', async () => {
        const mockError = new Error('Setup failed');
        const serializedError = { message: 'Setup failed', stack: 'stack trace' };

        setupNotificationResources.mockRejectedValue(mockError); // Імітуємо помилку
        serializeError.mockReturnValue(serializedError); // Мокаємо результат serializeError

        await expect(postDeployment()).rejects.toThrow(`Error: ${JSON.stringify(serializedError)}`);

        expect(setupNotificationResources).toHaveBeenCalled();
        expect(serializeError).toHaveBeenCalledWith(mockError);
    });
});
