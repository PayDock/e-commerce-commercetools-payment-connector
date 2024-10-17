import { isApolloError } from '@apollo/client';
import CryptoJS from 'crypto-js';

import {
  transformLocalizedStringToLocalizedField,
  transformLocalizedFieldToLocalizedString,
} from '@commercetools-frontend/l10n';


export const extractErrorFromGraphQlResponse = (graphQlResponse) => {
  if (graphQlResponse instanceof Error && isApolloError(graphQlResponse)) {
    if (
      typeof graphQlResponse.networkError?.result !== 'string' &&
      graphQlResponse.networkError?.result?.errors.length > 0
    ) {
      return graphQlResponse?.networkError?.result.errors;
    }

    if (graphQlResponse.graphQLErrors?.length > 0) {
      return graphQlResponse.graphQLErrors;
    }
  }

  return graphQlResponse;
};

const getNameFromPayload = (payload) => ({
  name: transformLocalizedStringToLocalizedField(payload.name),
});

const convertAction = (actionName, actionPayload) => ({
  [actionName]:
    actionName === 'changeName'
      ? getNameFromPayload(actionPayload)
      : actionPayload,
});

export const createGraphQlUpdateActions = (actions) =>
  actions.reduce(
    (previousActions, { action: actionName, ...actionPayload }) => [
      ...previousActions,
      convertAction(actionName, actionPayload),
    ],
    []
  );

export const convertToActionData = (draft) => ({
  ...draft,
  name: transformLocalizedFieldToLocalizedString(draft.nameAllLocales || []),
});


export const encrypt =  (data, secretKeyForEncryption) =>  {
  const encrypted = CryptoJS.AES.encrypt(data, secretKeyForEncryption).toString();
  return encrypted;
}

export const decrypt = (encryptedData, secretKeyForEncryption) => {
  const bytes = CryptoJS.AES.decrypt(encryptedData, secretKeyForEncryption);
  const decrypted = bytes.toString(CryptoJS.enc.Utf8);
  return decrypted;
}