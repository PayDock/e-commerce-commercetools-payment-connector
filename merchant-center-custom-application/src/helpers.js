import { isApolloError } from '@apollo/client';
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


export const encrypt = async (data, clientSecret) =>  {
  const keyArrayLen = clientSecret.length;

  return data.split("").map((dataElement, index) => {
    let remainder = index % keyArrayLen;

    return String.fromCharCode(dataElement.charCodeAt(0) * clientSecret.charCodeAt(remainder))
  }).join("");
}

export const decrypt = (data, clientSecret) => {
  const keyArrayLen = clientSecret.length;

  return data.split("").map((dataElement, index) => {
    let remainder = index % keyArrayLen;

    return String.fromCharCode(dataElement.charCodeAt(0) / clientSecret.charCodeAt(remainder))
  }).join("");
}