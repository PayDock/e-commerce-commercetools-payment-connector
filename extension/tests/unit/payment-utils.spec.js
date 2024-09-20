import {expect, jest, test} from '@jest/globals';
import {
    createSetCustomFieldAction,
    deleteCustomFieldAction,
    isValidMetadata,
    getPaymentKeyUpdateAction,
    createAddTransactionAction,
    createAddTransactionActionByResponse,
} from '../../src/paymentHandler/payment-utils.js';


describe('payment-utils', () => {

    test('createSetCustomFieldAction should return correct action when response is an object', () => {
        const name = 'testField';
        const response = { key: 'value' };
        const expectedAction = {
            action: 'setCustomField',
            name,
            value: JSON.stringify(response),
        };

        const result = createSetCustomFieldAction(name, response);
        expect(result).toEqual(expectedAction);
    });

    test('createSetCustomFieldAction should return correct action when response is a string', () => {
        const name = 'testField';
        const response = 'stringValue';
        const expectedAction = {
            action: 'setCustomField',
            name,
            value: response,
        };

        const result = createSetCustomFieldAction(name, response);
        expect(result).toEqual(expectedAction);
    });

    test('deleteCustomFieldAction should return correct action', () => {
        const name = 'testField';
        const expectedAction = {
            action: 'setCustomField',
            name,
            value: null,
        };

        const result = deleteCustomFieldAction(name);
        expect(result).toEqual(expectedAction);
    });

    test('isValidMetadata should return true for valid metadata', () => {
        const metadata = 'validMetadata';
        const result = isValidMetadata(metadata);
        expect(result).toBe(true);
    });

    test('isValidMetadata should return false for invalid metadata with spaces', () => {
        const metadata = 'invalid metadata';
        const result = isValidMetadata(metadata);
        expect(result).toBe(false);
    });

    test('isValidMetadata should return false for empty metadata', () => {
        const metadata = '';
        const result = isValidMetadata(metadata);
        expect(result).toBe(false);
    });


    test('getPaymentKeyUpdateAction should return action when response pspReference differs from paymentKey', () => {
        const paymentKey = 'oldKey';
        const request = {  reference: 'oldKey'  };
        const response = { pspReference: 'newPspReference' };
        const expectedAction = {
            action: 'setKey',
            key: 'newPspReference',
        };

        const result = getPaymentKeyUpdateAction(paymentKey, request, response);
        expect(result).toEqual(expectedAction);
    });

    test('getPaymentKeyUpdateAction should return undefined when new reference is the same as paymentKey', () => {
        const paymentKey = 'sameKey';
        const request = { reference: 'sameKey' };
        const response = {};

        const result = getPaymentKeyUpdateAction(paymentKey, request, response);
        expect(result).toBeUndefined();
    });

    test('createAddTransactionAction should return correct transaction action', () => {
        const transactionDetails = {
            type: 'Authorization',
            state: 'Success',
            amount: 10000,
            currency: 'USD',
            interactionId: 'interaction123',
            custom: { key: 'value' },
        };
        const expectedAction = {
            action: 'addTransaction',
            transaction: {
                type: transactionDetails.type,
                amount: {
                    currencyCode: transactionDetails.currency,
                    centAmount: transactionDetails.amount,
                },
                state: transactionDetails.state,
                interactionId: transactionDetails.interactionId,
                custom: transactionDetails.custom,
            },
        };

        const result = createAddTransactionAction(transactionDetails);
        expect(result).toEqual(expectedAction);
    });

    test('createAddTransactionActionByResponse should return correct action for Authorised', () => {
        const amount = 10000;
        const currencyCode = 'USD';
        const response = { resultCode: 'Authorised', pspReference: 'psp123' };
        const expectedAction = {
            action: 'addTransaction',
            transaction: {
                type: 'Authorization',
                amount: {
                    currencyCode,
                    centAmount: amount,
                },
                state: 'Success',
                interactionId: response.pspReference,
            },
        };

        const result = createAddTransactionActionByResponse(amount, currencyCode, response);
        expect(result).toEqual(expectedAction);
    });

    test('createAddTransactionActionByResponse should return correct action for Refused', () => {
        const amount = 10000;
        const currencyCode = 'USD';
        const response = { resultCode: 'Refused', pspReference: 'psp123' };
        const expectedAction = {
            action: 'addTransaction',
            transaction: {
                type: 'Authorization',
                amount: {
                    currencyCode,
                    centAmount: amount,
                },
                state: 'Failure',
                interactionId: response.pspReference,
            },
        };

        const result = createAddTransactionActionByResponse(amount, currencyCode, response);
        expect(result).toEqual(expectedAction);
    });

    test('createAddTransactionActionByResponse should return null for unknown resultCode', () => {
        const amount = 10000;
        const currencyCode = 'USD';
        const response = { resultCode: 'Unknown' };

        const result = createAddTransactionActionByResponse(amount, currencyCode, response);
        expect(result).toBeNull();
    });
});
