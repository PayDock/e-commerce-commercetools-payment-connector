import {expect, jest} from '@jest/globals';
import {
    hasValidAuthorizationHeader,
    getAuthorizationRequestHeader,
    generateBasicAuthorizationHeaderValue,
} from '../../src/validator/authentication';
import config from '../../src/config/config';

jest.mock('../../src/config/config-loader.js', () => {
    const originalModule = jest.requireActual('../../src/config/config-loader.js');
    const loaderConfigResult = jest.requireActual('../../test-data/extentionConfig.json')

    return {
        __esModule: true,
        ...originalModule,
        loadConfig: jest.fn(() => loaderConfigResult),
    };
});

jest.mock('../../src/config/config.js');

describe('authentication.js', () => {
    let ctpConfigMock;

    beforeEach(() => {
        ctpConfigMock = {
            clientId: 'testClientId',
            clientSecret: 'testClientSecret',
        };

        config.getExtensionConfig.mockReturnValue(ctpConfigMock);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('hasValidAuthorizationHeader', () => {
        it('should return false if authTokenString is missing or invalid', () => {
            expect(hasValidAuthorizationHeader(null)).toBe(false);
            expect(hasValidAuthorizationHeader('')).toBe(false);
            expect(hasValidAuthorizationHeader('invalidtoken')).toBe(false);
        });

        it('should return false if the authorization header does not match the configured clientId and clientSecret', () => {
            const authTokenString = `Basic ${Buffer.from('wrongClientId:wrongClientSecret').toString('base64')}`;

            expect(hasValidAuthorizationHeader(authTokenString)).toBe(false);
        });

        it('should return true if the authorization header matches the configured clientId and clientSecret', () => {
            const authTokenString = `Basic ${Buffer.from(`${ctpConfigMock.clientId}:${ctpConfigMock.clientSecret}`).toString('base64')}`;

            expect(hasValidAuthorizationHeader(authTokenString)).toBe(true);
        });
    });

    describe('getAuthorizationRequestHeader', () => {
        it('should return the authorization header if it exists', () => {
            const request = {
                headers: {
                    authorization: 'Bearer some-token',
                },
            };

            expect(getAuthorizationRequestHeader(request)).toBe('Bearer some-token');
        });

        it('should return undefined if the authorization header does not exist', () => {
            const request = {
                headers: {},
            };

            expect(getAuthorizationRequestHeader(request)).toBeUndefined();
        });

        it('should return undefined if the request object is null or undefined', () => {
            expect(getAuthorizationRequestHeader(null)).toBeUndefined();
            expect(getAuthorizationRequestHeader(undefined)).toBeUndefined();
        });
    });

    describe('generateBasicAuthorizationHeaderValue', () => {
        it('should return a valid Basic authorization header value when clientId and clientSecret are configured', () => {
            const expectedHeaderValue = `Basic ${Buffer.from(`${ctpConfigMock.clientId}:${ctpConfigMock.clientSecret}`).toString('base64')}`;

            expect(generateBasicAuthorizationHeaderValue()).toBe(expectedHeaderValue);
        });

        it('should return null if clientId or clientSecret are not configured', () => {
            config.getExtensionConfig.mockReturnValueOnce({clientId: null, clientSecret: null});

            expect(generateBasicAuthorizationHeaderValue()).toBeNull();
        });
    });
});
