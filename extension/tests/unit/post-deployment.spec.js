import {expect, test, jest} from '@jest/globals';

import { postDeployment } from '../../src/post-deployment.js';
import { setupExtensionResources } from '../../src/setup';
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
describe('postDeployment', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('should call setupExtensionResources without throwing an error', async () => {
        setupExtensionResources.mockResolvedValue(); // Імітуємо успішне виконання

        await expect(postDeployment()).resolves.not.toThrow();

        expect(setupExtensionResources).toHaveBeenCalled();
    });

    test('should throw an error if setupExtensionResources fails', async () => {
        const mockError = new Error('Setup failed');
        const serializedError = { message: 'Setup failed', stack: 'stack trace' };

        setupExtensionResources.mockRejectedValue(mockError); // Імітуємо помилку
        serializeError.mockReturnValue(serializedError); // Мокаємо результат serializeError

        await expect(postDeployment()).rejects.toThrow(`Error: ${JSON.stringify(serializedError)}`);

        expect(setupExtensionResources).toHaveBeenCalled();
        expect(serializeError).toHaveBeenCalledWith(mockError);
    });
});
