import { expect,  jest } from '@jest/globals';
import { setupServer } from '../../src/server.js';
import { getLogger } from '../../src/utils/logger.js';
import config from '../../src/config/config.js';

jest.mock('../../src/server.js', () => ({
    setupServer: jest.fn(),
}));

jest.mock('../../src/utils/logger.js', () => ({
    getLogger: jest.fn(() => ({
        info: jest.fn(),
    })),
}));

jest.mock('../../src/config/config.js', () => ({
    getModuleConfig: jest.fn(),
}));

describe('server setup', () => {
    let mockServer;
    let mockLogger;

    beforeEach(() => {
        mockServer = {
            listen: jest.fn((port, callback) => callback()),
            keepAliveTimeout: undefined,
        };
        mockLogger = {
            info: jest.fn(),
        };

        setupServer.mockReturnValue(mockServer);
        getLogger.mockReturnValue(mockLogger);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should setup server and start listening on default port', () => {
        config.getModuleConfig.mockReturnValue({ port: undefined });

        jest.requireActual('../../src/init.js');

        expect(setupServer).toHaveBeenCalled();
        expect(mockServer.listen).toHaveBeenCalledWith(8080, expect.any(Function));
        expect(mockLogger.info).toHaveBeenCalledWith('Notification module is running at http://0.0.0.0:8080');
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