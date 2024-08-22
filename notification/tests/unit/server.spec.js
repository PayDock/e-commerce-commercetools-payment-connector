import {expect, test, jest} from '@jest/globals';
import { setupServer } from '../../src/server.js';
import request from 'supertest';
import {c, handleNotification} from '../../src/api/notification/notification.controller.js';


jest.mock('../../src/api/notification/notification.controller.js');
jest.mock('../../src/config/config-loader.js', () => {
    const originalModule = jest.requireActual('../../src/config/config-loader.js');
    const loaderConfigResult = jest.requireActual('../../test-data/notificationConfig.json')

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

describe('Uint::Server::', () => {
    const server = setupServer();

    beforeEach(() => {
        server.listen(3001, 'localhost')
    })

    afterEach(() => {
        server.close();
    });

    test('500 error', () => {
        handleNotification.mockImplementation(jest.fn(() => {
            throw new Error()
        }));

        return request(server)
            .post('/')
            .send({test: 'test'})
            .expect(500)
    })
})