import { defineMessages } from 'react-intl';

export default defineMessages({
  pageTitle: {
    id: 'LiveConnection.pageTitle',
    defaultMessage: 'Live Connection',
  },
  pageSubtitle: {
    id: 'LiveConnection.pageSubtitle',
    defaultMessage:
      'Manage the configuration of the payment methods.',
  },

  credentialsTypeTitle: {
    id: 'LiveConnection.credentialsTypeTitle',
    defaultMessage: 'Connection to Paydock',
  },

  credentialsPublicKeyTitle: {
    id: 'LiveConnection.credentialsPublicKeyTitle',
    defaultMessage: 'Public Key',
  },
  credentialsPublicKeyDesc: {
    id: 'LiveConnection.credentialsPublicKeyDesc',
    defaultMessage: 'Enter the API public key for the live environment. This key is used for authentication to ensure secure communication with the Payment Gateway.',
  },

  credentialsSecretKeyTitle: {
    id: 'LiveConnection.credentialsSecretKeyTitle',
    defaultMessage: 'Secret Key',
  },
  credentialsSecretKeyDesc: {
    id: 'LiveConnection.credentialsSecretKeyDesc',
    defaultMessage: 'Enter the API secret key for the live environment. This key is used for authentication to ensure secure communication with the Payment Gateway.',
  },

  credentialsAccessKeyTitle: {
    id: 'LiveConnection.credentialsAccessKeyTitle',
    defaultMessage: 'API Access Token',
  },
  credentialsAccessKeyDesc: {
    id: 'LiveConnection.credentialsAccessKeyDesc',
    defaultMessage: 'Enter the Access Token for the live environment. This key is used for authentication to ensure secure communication with the Payment Gateway.',
  },
  credentialsWidgetAccessKeyTitle: {
    id: 'LiveConnection.credentialsWidgetAccessKeyTitle',
    defaultMessage: 'Widget Access Token',
  },
  credentialsWidgetAccessKeyDesc: {
    id: 'LiveConnection.credentialsWidgetAccessKeyDesc',
    defaultMessage: 'Enter the widget access token for authentication. This token is used to authorize widget transactions. It needs to be filled in only if API Public Key & API Secret Key is not entered.',
  },
  selectSandboxModeTitle: {
    id: 'LiveConnection.selectSandboxModeTitle',
    defaultMessage: 'Sandbox mode',
  },
  selectSandboxModeDesc: {
    id: 'LiveConnection.selectSandboxModeDesc',
    defaultMessage: 'To try the workflow in test mode, select “Yes”.',
  },

  cardCheckoutTitle: {
    id: 'LiveConnection.cardCheckoutTitle',
    defaultMessage: 'Use on checkout',
  },

  cardCheckoutDesc: {
    id: 'LiveConnection.cardCheckoutDesc',
    defaultMessage: 'Select “Yes” to make option available on checkout.',
  },

  cardsSelectSupportedCard: {
    id: 'LiveConnection.cardsSelectSupportedCard',
    defaultMessage: 'Supported card schemes',
  },

  cardsGatewayId: {
    id: 'LiveConnection.cardsGatewayId',
    defaultMessage: 'Gateway ID',
  },

  cardsSelect3DS: {
    id: 'LiveConnection.cardsSelect3DS',
    defaultMessage: '3DS',
  },
  cards3DSservice: {
    id: 'LiveConnection.cards3DSservice',
    defaultMessage: '3DS service ID',
  },
  cards3DSflow: {
    id: 'LiveConnection.cards3DSflow',
    defaultMessage: '3DS flow',
  },

  cardsSelectFraud: {
    id: 'LiveConnection.cardsSelectFraud',
    defaultMessage: 'Fraud',
  },
  cardsFraudService: {
    id: 'LiveConnection.cardsFraudService',
    defaultMessage: 'Fraud service ID',
  },

  cardsSelectDirectChargeTitle: {
    id: 'LiveConnection.cardsSelectDirectChargeTitle',
    defaultMessage: 'Direct charge',
  },
  cardsSelectDirectChargeDescription: {
    id: 'LiveConnection.cardsSelectDirectChargeDescription',
    defaultMessage: 'Direct charge stands for authorization and capture in a single request',
  },

  cardsSelectSaveCardTitle: {
    id: 'LiveConnection.cardsSelectSaveCardTitle',
    defaultMessage: 'Save card',
  },
  cardsSelectSaveCardDescription: {
    id: 'LiveConnection.cardsSelectSaveCardDescription',
    defaultMessage: 'Offer your customer to save the card permanently at Paydock for further usage',
  },

  cardsSelectSaveCardMethod: {
    id: 'LiveConnection.cardsSelectSaveCardMethod',
    defaultMessage: 'Save card method',
  },


  bankAccountsCheckoutTitle: {
    id: 'LiveConnection.bankAccountsCheckoutTitle',
    defaultMessage: 'Use on checkout',
  },

  bankAccountsCheckoutDesc: {
    id: 'LiveConnection.bankAccountsCheckoutDesc',
    defaultMessage: 'Select “Yes” to make option available on checkout.',
  },

  banksAccountGatewayId: {
    id: 'LiveConnection.banksAccountGatewayId',
    defaultMessage: 'Gateway ID',
  },

  banksAccountSaveTitle: {
    id: 'LiveConnection.banksAccountSaveTitle',
    defaultMessage: 'Save bank account',
  },
  banksAccountSaveDesc: {
    id: 'LiveConnection.banksAccountSaveDesc',
    defaultMessage: 'Offer your customer to save the bank account permanently at Paydock for further usage',
  },

  banksAccountSaveMethodTitle: {
    id: 'LiveConnection.banksAccountSaveMethodTitle',
    defaultMessage: 'Save bank account method',
  },


  walletApplePayCheckoutTitle: {
    id: 'LiveConnection.walletApplePayCheckoutTitle',
    defaultMessage: 'Use on checkout',
  },
  walletApplePayCheckoutDesc: {
    id: 'LiveConnection.walletApplePayCheckoutDesc',
    defaultMessage: 'Select “Yes” to make option available on checkout.',
  },

  walletApplePayGatewayId: {
    id: 'LiveConnection.walletApplePayGatewayId',
    defaultMessage: 'Gateway ID',
  },

  walletApplePaySelectFraud: {
    id: 'LiveConnection.walletApplePaySelectFraud',
    defaultMessage: 'Fraud',
  },
  walletApplePayFraudService: {
    id: 'LiveConnection.walletApplePayFraudService',
    defaultMessage: 'Fraud service ID',
  },

  walletApplePaySelectDirectChargeTitle: {
    id: 'LiveConnection.walletApplePaySelectDirectChargeTitle',
    defaultMessage: 'Direct charge',
  },
  walletApplePaySelectDirectChargeDescription: {
    id: 'LiveConnection.walletApplePaySelectDirectChargeDescription',
    defaultMessage: 'Direct charge stands for authorization and capture in a single request',
  },



  walletGooglePayCheckoutTitle: {
    id: 'LiveConnection.walletGooglePayCheckoutTitle',
    defaultMessage: 'Use on checkout',
  },
  walletGooglePayCheckoutDesc: {
    id: 'LiveConnection.walletGooglePayCheckoutDesc',
    defaultMessage: 'Select “Yes” to make option available on checkout.',
  },

  walletGooglePayGatewayId: {
    id: 'LiveConnection.walletGooglePayGatewayId',
    defaultMessage: 'Gateway ID',
  },

  walletGooglePaySelectFraud: {
    id: 'LiveConnection.walletGooglePaySelectFraud',
    defaultMessage: 'Fraud',
  },
  walletGooglePayFraudService: {
    id: 'LiveConnection.walletGooglePayFraudService',
    defaultMessage: 'Fraud service ID',
  },

  walletGooglePaySelectDirectChargeTitle: {
    id: 'LiveConnection.walletGooglePaySelectDirectChargeTitle',
    defaultMessage: 'Direct charge',
  },
  walletGooglePaySelectDirectChargeDescription: {
    id: 'LiveConnection.walletGooglePaySelectDirectChargeDescription',
    defaultMessage: 'Direct charge stands for authorization and capture in a single request',
  },



  walletPAYPALCheckoutTitle: {
    id: 'LiveConnection.walletPAYPALCheckoutTitle',
    defaultMessage: 'Use on checkout',
  },
  walletPAYPALCheckoutDesc: {
    id: 'LiveConnection.walletPAYPALCheckoutDesc',
    defaultMessage: 'Select “Yes” to make option available on checkout.',
  },

  walletPAYPALGatewayId: {
    id: 'LiveConnection.walletGooglePayGatewayId',
    defaultMessage: 'Gateway ID',
  },

  walletPAYPALSelectFraud: {
    id: 'LiveConnection.walletPAYPALSelectFraud',
    defaultMessage: 'Fraud',
  },
  walletPAYPALFraudService: {
    id: 'LiveConnection.walletPAYPALFraudService',
    defaultMessage: 'Fraud service ID',
  },

  walletPAYPALSelectDirectChargeTitle: {
    id: 'LiveConnection.walletPAYPALSelectDirectChargeTitle',
    defaultMessage: 'Direct charge',
  },
  walletPAYPALSelectDirectChargeDescription: {
    id: 'LiveConnection.walletPAYPALSelectDirectChargeDescription',
    defaultMessage: 'Direct charge stands for authorization and capture in a single request',
  },

  walletPAYPALSelectPayLaterTitle: {
    id: 'LiveConnection.walletPAYPALSelectPayLaterTitle',
    defaultMessage: 'Pay later',
  },



  walletZippayCheckoutTitle: {
    id: 'LiveConnection.walletZippayCheckoutTitle',
    defaultMessage: 'Use on checkout',
  },
  walletZippayCheckoutDesc: {
    id: 'LiveConnection.walletZippayCheckoutDesc',
    defaultMessage: 'Select “Yes” to make option available on checkout.',
  },

  walletZippayGatewayId: {
    id: 'LiveConnection.walletZippayGatewayId',
    defaultMessage: 'Gateway ID',
  },

  walletZippaySelectFraud: {
    id: 'LiveConnection.walletZippaySelectFraud',
    defaultMessage: 'Fraud',
  },
  walletZippayFraudService: {
    id: 'LiveConnection.walletZippayFraudService',
    defaultMessage: 'Fraud service ID',
  },

  walletZippaySelectDirectChargeTitle: {
    id: 'LiveConnection.walletZippaySelectDirectChargeTitle',
    defaultMessage: 'Direct charge',
  },
  walletZippaySelectDirectChargeDescription: {
    id: 'LiveConnection.walletZippaySelectDirectChargeDescription',
    defaultMessage: 'Direct charge stands for authorization and capture in a single request',
  },



  walletAfterpayCheckoutTitle: {
    id: 'LiveConnection.walletAfterpayCheckoutTitle',
    defaultMessage: 'Use on checkout',
  },
  walletAfterpayCheckoutDesc: {
    id: 'LiveConnection.walletAfterpayCheckoutDesc',
    defaultMessage: 'Select “Yes” to make option available on checkout.',
  },

  walletAfterpayGatewayId: {
    id: 'LiveConnection.walletAfterpayGatewayId',
    defaultMessage: 'Gateway ID',
  },

  walletAfterpaySelectFraud: {
    id: 'LiveConnection.walletAfterpaySelectFraud',
    defaultMessage: 'Fraud',
  },
  walletAfterpayFraudService: {
    id: 'LiveConnection.walletAfterpayFraudService',
    defaultMessage: 'Fraud service ID',
  },

  walletAfterpaySelectDirectChargeTitle: {
    id: 'LiveConnection.walletAfterpaySelectDirectChargeTitle',
    defaultMessage: 'Direct charge',
  },
  walletAfterpaySelectDirectChargeDescription: {
    id: 'LiveConnection.walletAfterpaySelectDirectChargeDescription',
    defaultMessage: 'Direct charge stands for authorization and capture in a single request',
  },


});
