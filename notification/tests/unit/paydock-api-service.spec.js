import {jest, expect} from "@jest/globals";

import {callPaydock} from '../../src/handler/notification/paydock-api-service.js';

import fetch from 'node-fetch';
import config from '../../src/config/config.js';
import {serializeError} from 'serialize-error';

jest.mock('node-fetch', () => jest.fn());
jest.mock('../../src/config/config.js');
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

describe('callPaydock', () => {
    let url, data, method;

    beforeEach(() => {
        url = '/test-url';
        data = {key: 'value'};
        method = 'POST';
        config.getPaydockApiUrl.mockResolvedValue('https://api.paydock.com/');
        config.getPaydockConfig.mockResolvedValue({
            credentials_secret_key: 'test_secret_key'
        });
    });

    test('should successfully call Paydock API and return response and request', async () => {
        const mockFetchResponse = {
            ok: true,
            text: jest.fn().mockResolvedValueOnce(JSON.stringify({key: 'response'})),
        };
        fetch.mockResolvedValueOnce(mockFetchResponse);
        const result = await callPaydock(url, data, method);
        expect(result.request.headers).toEqual( {
            'Content-Type': 'application/json',
            'x-user-secret-key': 'test_secret_key'
        });
    });
});