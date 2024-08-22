import { expect,  jest } from '@jest/globals';
import { setupServer } from '../../src/server.js';
import utils from '../../src/utils.js';
import config from '../../src/config/config.js';

jest.mock('../../src/server.js');
jest.mock('../../src/utils.js');
jest.mock('../../src/config/config.js');

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
describe('Server setup', () => {
    let mockServer;
    let mockLogger;

    beforeEach(() => {
        mockServer = {
            listen: jest.fn((port, callback) => callback()),
            keepAliveTimeout: undefined,
        };
        setupServer.mockReturnValue(mockServer);

        mockLogger = {
            info: jest.fn(),
        };
        utils.getLogger.mockReturnValue(mockLogger);

        config.getModuleConfig.mockReturnValue({
            port: 8080,
            keepAliveTimeout: 5000,
        });
    });

    test('should set up the server and start it with correct port', () => {
        jest.requireActual('../../src/init.js');
        expect(setupServer).toHaveBeenCalled();
        expect(mockServer.listen).toHaveBeenCalledWith(8080, expect.any(Function));
        expect(mockLogger.info).toHaveBeenCalledWith(
            'Extension module is re running at http://0.0.0.0:8080'
        );
    });

    test('should not set keepAliveTimeout if undefined in config', () => {
        config.getModuleConfig.mockReturnValue({
            port: 8080,
            keepAliveTimeout: undefined,
        });

        jest.requireActual('../../src/init.js');

        expect(mockServer.keepAliveTimeout).toBeUndefined();
    });

});