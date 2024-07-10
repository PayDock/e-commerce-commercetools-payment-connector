import { defineMessages } from 'react-intl';

export default defineMessages({
  pageTitle: {
    id: 'SandboxConnection.pageTitle',
    defaultMessage: 'Sandbox Connection',
  },
  pageSubtitle: {
    id: 'SandboxConnection.pageSubtitle',
    defaultMessage:
      'Manage the configuration of the payment methods.',
  },

  credentialsTypeTitle: {
    id: 'SandboxConnection.credentialsTypeTitle',
    defaultMessage: 'Connection to Paydock',
  },

  credentialsPublicKeyTitle: {
    id: 'SandboxConnection.credentialsPublicKeyTitle',
    defaultMessage: 'Public Key',
  },
  credentialsPublicKeyDesc: {
    id: 'SandboxConnection.credentialsPublicKeyDesc',
    defaultMessage: 'Enter the API public key for the live environment. This key is used for authentication to ensure secure communication with the Payment Gateway.',
  },

  credentialsSecretKeyTitle: {
    id: 'SandboxConnection.credentialsSecretKeyTitle',
    defaultMessage: 'Secret Key',
  },
  credentialsSecretKeyDesc: {
    id: 'SandboxConnection.credentialsSecretKeyDesc',
    defaultMessage: 'Enter the API secret key for the live environment. This key is used for authentication to ensure secure communication with the Payment Gateway.',
  },
  credentialsAccessKeyTitle: {
    id: 'SandboxConnection.credentialsAccessKeyTitle',
    defaultMessage: 'API Access Token',
  },
  credentialsAccessKeyDesc: {
    id: 'SandboxConnection.credentialsAccessKeyDesc',
    defaultMessage: 'Enter the API access token for authentication. This token is used to authorize transactions. It needs to be filled in only if API Public Key API Secret Key is not entered.',
  },

  credentialsWidgetAccessKeyTitle: {
    id: 'SandboxConnection.credentialsWidgetAccessKeyTitle',
    defaultMessage: 'Widget Access Token',
  },
  credentialsWidgetAccessKeyDesc: {
    id: 'SandboxConnection.credentialsWidgetAccessKeyDesc',
    defaultMessage: 'Enter the widget access token for authentication. This token is used to authorize widget transactions. It needs to be filled in only if API Public Key & API Secret Key is not entered.',
  },

  selectSandboxModeTitle: {
    id: 'SandboxConnection.selectSandboxModeTitle',
    defaultMessage: 'Sandbox mode',
  },
  selectSandboxModeDesc: {
    id: 'SandboxConnection.selectSandboxModeDesc',
    defaultMessage: 'To try the workflow in test mode, select “Yes”.',
  },

  cardCheckoutTitle: {
    id: 'SandboxConnection.cardCheckoutTitle',
    defaultMessage: 'Use on checkout',
  },

  cardCheckoutDesc: {
    id: 'SandboxConnection.cardCheckoutDesc',
    defaultMessage: 'Select “Yes” to make option available on checkout.',
  },

  cardsSelectSupportedCard: {
    id: 'SandboxConnection.cardsSelectSupportedCard',
    defaultMessage: 'Supported card schemes',
  },

  cardsGatewayId: {
    id: 'SandboxConnection.cardsGatewayId',
    defaultMessage: 'Gateway ID',
  },

  cardsSelect3DS: {
    id: 'SandboxConnection.cardsSelect3DS',
    defaultMessage: '3DS',
  },
  cards3DSservice: {
    id: 'SandboxConnection.cards3DSservice',
    defaultMessage: '3DS service ID',
  },
  cards3DSflow: {
    id: 'SandboxConnection.cards3DSflow',
    defaultMessage: '3DS flow',
  },

  cardsSelectFraud: {
    id: 'SandboxConnection.cardsSelectFraud',
    defaultMessage: 'Fraud',
  },
  cardsFraudService: {
    id: 'SandboxConnection.cardsFraudService',
    defaultMessage: 'Fraud service ID',
  },

  cardsSelectDirectChargeTitle: {
    id: 'SandboxConnection.cardsSelectDirectChargeTitle',
    defaultMessage: 'Direct charge',
  },
  cardsSelectDirectChargeDescription: {
    id: 'SandboxConnection.cardsSelectDirectChargeDescription',
    defaultMessage: 'Direct charge stands for authorization and capture in a single request',
  },

  cardsSelectSaveCardTitle: {
    id: 'SandboxConnection.cardsSelectSaveCardTitle',
    defaultMessage: 'Save card',
  },
  cardsSelectSaveCardDescription: {
    id: 'SandboxConnection.cardsSelectSaveCardDescription',
    defaultMessage: 'Offer your customer to save the card permanently at Paydock for further usage',
  },

  cardsSelectSaveCardMethod: {
    id: 'SandboxConnection.cardsSelectSaveCardMethod',
    defaultMessage: 'Save card method',
  },


  bankAccountsCheckoutTitle: {
    id: 'SandboxConnection.bankAccountsCheckoutTitle',
    defaultMessage: 'Use on checkout',
  },

  bankAccountsCheckoutDesc: {
    id: 'SandboxConnection.bankAccountsCheckoutDesc',
    defaultMessage: 'Select “Yes” to make option available on checkout.',
  },

  banksAccountGatewayId: {
    id: 'SandboxConnection.banksAccountGatewayId',
    defaultMessage: 'Gateway ID',
  },

  banksAccountSaveTitle: {
    id: 'SandboxConnection.banksAccountSaveTitle',
    defaultMessage: 'Save bank account',
  },
  banksAccountSaveDesc: {
    id: 'SandboxConnection.banksAccountSaveDesc',
    defaultMessage: 'Offer your customer to save the bank account permanently at Paydock for further usage',
  },

  banksAccountSaveMethodTitle: {
    id: 'SandboxConnection.banksAccountSaveMethodTitle',
    defaultMessage: 'Save bank account method',
  },


  walletApplePayCheckoutTitle: {
    id: 'SandboxConnection.walletApplePayCheckoutTitle',
    defaultMessage: 'Use on checkout',
  },
  walletApplePayCheckoutDesc: {
    id: 'SandboxConnection.walletApplePayCheckoutDesc',
    defaultMessage: 'Select “Yes” to make option available on checkout.',
  },

  walletApplePayGatewayId: {
    id: 'SandboxConnection.walletApplePayGatewayId',
    defaultMessage: 'Gateway ID',
  },

  walletApplePaySelectFraud: {
    id: 'SandboxConnection.walletApplePaySelectFraud',
    defaultMessage: 'Fraud',
  },
  walletApplePayFraudService: {
    id: 'SandboxConnection.walletApplePayFraudService',
    defaultMessage: 'Fraud service ID',
  },

  walletApplePaySelectDirectChargeTitle: {
    id: 'SandboxConnection.walletApplePaySelectDirectChargeTitle',
    defaultMessage: 'Direct charge',
  },
  walletApplePaySelectDirectChargeDescription: {
    id: 'SandboxConnection.walletApplePaySelectDirectChargeDescription',
    defaultMessage: 'Direct charge stands for authorization and capture in a single request',
  },



  walletGooglePayCheckoutTitle: {
    id: 'SandboxConnection.walletGooglePayCheckoutTitle',
    defaultMessage: 'Use on checkout',
  },
  walletGooglePayCheckoutDesc: {
    id: 'SandboxConnection.walletGooglePayCheckoutDesc',
    defaultMessage: 'Select “Yes” to make option available on checkout.',
  },

  walletGooglePayGatewayId: {
    id: 'SandboxConnection.walletGooglePayGatewayId',
    defaultMessage: 'Gateway ID',
  },

  walletGooglePaySelectFraud: {
    id: 'SandboxConnection.walletGooglePaySelectFraud',
    defaultMessage: 'Fraud',
  },
  walletGooglePayFraudService: {
    id: 'SandboxConnection.walletGooglePayFraudService',
    defaultMessage: 'Fraud service ID',
  },

  walletGooglePaySelectDirectChargeTitle: {
    id: 'SandboxConnection.walletGooglePaySelectDirectChargeTitle',
    defaultMessage: 'Direct charge',
  },
  walletGooglePaySelectDirectChargeDescription: {
    id: 'SandboxConnection.walletGooglePaySelectDirectChargeDescription',
    defaultMessage: 'Direct charge stands for authorization and capture in a single request',
  },



  walletPAYPALCheckoutTitle: {
    id: 'SandboxConnection.walletPAYPALCheckoutTitle',
    defaultMessage: 'Use on checkout',
  },
  walletPAYPALCheckoutDesc: {
    id: 'SandboxConnection.walletPAYPALCheckoutDesc',
    defaultMessage: 'Select “Yes” to make option available on checkout.',
  },

  walletPAYPALGatewayId: {
    id: 'SandboxConnection.walletGooglePayGatewayId',
    defaultMessage: 'Gateway ID',
  },

  walletPAYPALSelectFraud: {
    id: 'SandboxConnection.walletPAYPALSelectFraud',
    defaultMessage: 'Fraud',
  },
  walletPAYPALFraudService: {
    id: 'SandboxConnection.walletPAYPALFraudService',
    defaultMessage: 'Fraud service ID',
  },

  walletPAYPALSelectDirectChargeTitle: {
    id: 'SandboxConnection.walletPAYPALSelectDirectChargeTitle',
    defaultMessage: 'Direct charge',
  },
  walletPAYPALSelectDirectChargeDescription: {
    id: 'SandboxConnection.walletPAYPALSelectDirectChargeDescription',
    defaultMessage: 'Direct charge stands for authorization and capture in a single request',
  },

  walletPAYPALSelectPayLaterTitle: {
    id: 'SandboxConnection.walletPAYPALSelectPayLaterTitle',
    defaultMessage: 'Pay later',
  },



  walletZippayCheckoutTitle: {
    id: 'SandboxConnection.walletZippayCheckoutTitle',
    defaultMessage: 'Use on checkout',
  },
  walletZippayCheckoutDesc: {
    id: 'SandboxConnection.walletZippayCheckoutDesc',
    defaultMessage: 'Select “Yes” to make option available on checkout.',
  },

  walletZippayGatewayId: {
    id: 'SandboxConnection.walletZippayGatewayId',
    defaultMessage: 'Gateway ID',
  },

  walletZippaySelectFraud: {
    id: 'SandboxConnection.walletZippaySelectFraud',
    defaultMessage: 'Fraud',
  },
  walletZippayFraudService: {
    id: 'SandboxConnection.walletZippayFraudService',
    defaultMessage: 'Fraud service ID',
  },

  walletZippaySelectDirectChargeTitle: {
    id: 'SandboxConnection.walletZippaySelectDirectChargeTitle',
    defaultMessage: 'Direct charge',
  },
  walletZippaySelectDirectChargeDescription: {
    id: 'SandboxConnection.walletZippaySelectDirectChargeDescription',
    defaultMessage: 'Direct charge stands for authorization and capture in a single request',
  },



  walletAfterpayCheckoutTitle: {
    id: 'SandboxConnection.walletAfterpayCheckoutTitle',
    defaultMessage: 'Use on checkout',
  },
  walletAfterpayCheckoutDesc: {
    id: 'SandboxConnection.walletAfterpayCheckoutDesc',
    defaultMessage: 'Select “Yes” to make option available on checkout.',
  },

  walletAfterpayGatewayId: {
    id: 'SandboxConnection.walletAfterpayGatewayId',
    defaultMessage: 'Gateway ID',
  },

  walletAfterpaySelectFraud: {
    id: 'SandboxConnection.walletAfterpaySelectFraud',
    defaultMessage: 'Fraud',
  },
  walletAfterpayFraudService: {
    id: 'SandboxConnection.walletAfterpayFraudService',
    defaultMessage: 'Fraud service ID',
  },

  walletAfterpaySelectDirectChargeTitle: {
    id: 'SandboxConnection.walletAfterpaySelectDirectChargeTitle',
    defaultMessage: 'Direct charge',
  },
  walletAfterpaySelectDirectChargeDescription: {
    id: 'SandboxConnection.walletAfterpaySelectDirectChargeDescription',
    defaultMessage: 'Direct charge stands for authorization and capture in a single request',
  },


});
