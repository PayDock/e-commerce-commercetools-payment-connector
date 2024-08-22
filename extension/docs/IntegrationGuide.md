# Integration Guide

**Table of Contents**

 - [How it works](#how-it-works)
    - [Step 1: Setting up the connector using the Commercetools Paydock Custom Aplication](#step-1-configuration-connector)
    - [Step 2: Get payment methods](#step-2-get-payment-methods)
    - [Step 3: Make a payment](#step-3-make-a-payment)
    - [Step 4: Update Payment Status](#step-4-update-payment-status)
  - [Test](#test)
  - [See also](#see-also)
  - [License](#license)
<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## How It Works

### Step 1: Configuration connector
To set up the connector, install and integrate the [Commercetools Paydock Custom Application](../merchant-center-custom-application/docs/IntegrationGuide.md) into your commercetools platform. This application allows you to configure both live and sandbox connections to Paydock. Additionally, you can view logs and orders processed through the Paydock payment system.
![Custom Application Screenshot](custom-aplication-img.png)


### Step-2: Get payment methods
To access a list of allowed Paydock payment methods and create a new payment in commercetools, you need to set the `PaymentExtensionRequest` custom field with the parameter `getPaymentMethodsRequest`. Configure your payment request as follows:

```
{
  "amountPlanned": {
    "currencyCode": "AUD",
    "centAmount": 100
  },
  "paymentMethodInfo": {
     paymentInterface: "Mock",
     method: "paydock-pay"
  },
  "custom": {
     type: {
        typeId: "type",
        key: "paydock-components-payment-type"
     },
     fields: {
        CommercetoolsProjectKey: {projectKey},
        PaymentExtensionRequest: "{"action":"getPaymentMethodsRequest","request":{}}"
     }
  }
}
```
This will populate the `Payment Extension Response` custom field with a list of payment methods and necessary configurations for Paydock widgets initialization.

```
{
   "id": "c****2-1baef95a****f",
   ....
   "custom": {
      "type": {
         "typeId": "type",
         "id": "31650638-42fc-439e-902e-199589009ed3"
      },
      "fields": {
         "CommercetoolsProjectKey": "{projectKey}",
         "PaymentExtensionResponse": "{\"sandbox_mode\":\"Yes\",\"api_credentials\":{\"credentials_type\":\"credentials\",\"credentials_public_key\":\"d3a148dbbb7b8342d6f62e8fc39c230a297d4a94\",\"credentials_widget_access_key\":\"\"},\"payment_methods\":{\"card\":{\"name\":\"paydock-pay-card\",\"type\":\"card\",\"title\":\"Card\",\"description\":\"\",\"config\":{\"card_use_on_checkout\":\"Yes\",\"card_gateway_id\":\"65e7225fdb7996a960d387f3\",\"card_3ds\":\"Disable\",\"card_3ds_service_id\":\"661005420fbeec4e6a9de3f1\",\"card_3ds_flow\":\"With vault\",\"card_fraud\":\"In-built Fraud\",\"card_fraud_service_id\":\"656efdcb61c0179a82a6d7cd\",\"card_direct_charge\":\"Enable\",\"card_supported_card_schemes\":[{\"value\":\"mastercard\",\"label\":\"MasterCard\"},{\"value\":\"discover\",\"label\":\"Discover\"},{\"value\":\"amex\",\"label\":\"American Express\"},{\"value\":\"visa\",\"label\":\"Visa, Visa Electron\"},{\"value\":\"visa_white\",\"label\":\"Visa White\"}],\"card_card_save\":\"Disable\",\"card_card_method_save\":\"Vault token\"}},\"bank_accounts\":{\"name\":\"paydock-pay-bank-accounts\",\"type\":\"bank_accounts\",\"title\":\"\",\"description\":\"\",\"config\":{\"bank_accounts_use_on_checkout\":\"No\",\"bank_accounts_gateway_id\":\"\",\"bank_accounts_bank_account_save\":\"Disable\",\"bank_accounts_bank_method_save\":\"Vault token\"}},\"apple-pay\":{\"name\":\"paydock-pay-apple-pay\",\"type\":\"apple-pay\",\"config\":{\"wallets_apple_pay_use_on_checkout\":\"Yes\",\"wallets_apple_pay_gateway_id\":\"662bc1453c27374a7ad8ee47\",\"wallets_apple_pay_fraud\":\"Disable\",\"wallets_apple_pay_fraud_service_id\":\"656efdcb61c0179a82a6d7cd\",\"wallets_apple_pay_direct_charge\":\"Disable\"}},\"google-pay\":{\"name\":\"paydock-pay-google-pay\",\"type\":\"google-pay\",\"config\":{\"wallets_google_pay_use_on_checkout\":\"Yes\",\"wallets_google_pay_gateway_id\":\"63da308a33020e1cd630371f\",\"wallets_google_pay_fraud\":\"Disable\",\"wallets_google_pay_fraud_service_id\":\"656efdcb61c0179a82a6d7cd\",\"wallets_google_pay_direct_charge\":\"Enable\"}},\"afterpay_v2\":{\"name\":\"paydock-pay-afterpay_v2\",\"type\":\"afterpay_v2\",\"config\":{\"wallets_afterpay_v2_use_on_checkout\":\"\",\"wallets_afterpay_v2_gateway_id\":\"\",\"wallets_afterpay_v2_fraud\":\"Disable\",\"wallets_afterpay_v2_direct_charge\":\"Disable\",\"wallets_afterpay_v2_fraud_service_id\":\"\"}},\"paypal_smart\":{\"name\":\"paydock-pay-paypal_smart\",\"type\":\"paypal_smart\",\"config\":{\"wallets_paypal_smart_button_use_on_checkout\":\"Yes\",\"wallets_paypal_smart_button_gateway_id\":\"660eafbb701c5aecfa6985b5\",\"wallets_paypal_smart_button_fraud\":\"Disable\",\"wallets_paypal_smart_button_fraud_service_id\":\"656efdcb61c0179a82a6d7cd\",\"wallets_paypal_smart_button_direct_charge\":\"Disable\",\"wallets_paypal_smart_button_pay_later\":\"Disable\"}},\"afterpay_v1\":{\"name\":\"paydock-pay-afterpay_v1\",\"type\":\"afterpay_v1\",\"config\":{\"alternative_payment_methods_afterpay_v1_use_on_checkout\":\"Yes\",\"alternative_payment_methods_afterpay_v1_gateway_id\":\"63ea4620a412be2c507ce257\",\"alternative_payment_methods_afterpay_v1_fraud\":\"Disable\",\"alternative_payment_methods_afterpay_v1_fraud_service_id\":\"656efdcb61c0179a82a6d7cd\",\"alternative_payment_methods_afterpay_v1_direct_charge\":\"Enable\"}},\"zippay\":{\"name\":\"paydock-pay-zippay\",\"type\":\"zippay\",\"config\":{\"alternative_payment_methods_zippay_use_on_checkout\":\"Yes\",\"alternative_payment_methods_zippay_gateway_id\":\"63ea4c89a412be2c507ce341\",\"alternative_payment_methods_zippay_fraud\":\"Disable\",\"alternative_payment_methods_zippay_direct_charge\":\"Enable\",\"alternative_payment_methods_zippay_fraud_service_id\":\"656efdcb61c0179a82a6d7cd\"}}},\"widget_configuration\":{\"version\":{\"version_version\":\"Latest\",\"version_custom_version\":\"\"},\"payment_methods\":{\"cards\":{\"payment_methods_cards_title\":\"Card\",\"payment_methods_cards_description\":\"\"},\"bank_accounts\":{\"payment_methods_bank_accounts_title\":\"\",\"payment_methods_bank_accounts_description\":\"\"},\"wallets\":{\"payment_methods_wallets_apple_pay_title\":\"Apple Pay\",\"payment_methods_wallets_apple_pay_description\":\"\",\"payment_methods_wallets_google_pay_title\":\"Google Pay\",\"payment_methods_wallets_google_pay_description\":\"\",\"payment_methods_wallets_afterpay_v2_title\":\"\",\"payment_methods_wallets_afterpay_v2_description\":\"\",\"payment_methods_wallets_paypal_title\":\"Paypal\",\"payment_methods_wallets_paypal_description\":\"\"},\"alternative_payment_methods\":{\"payment_methods_alternative_payment_method_afterpay_v1_title\":\"Afterpay V1\",\"payment_methods_alternative_payment_method_afterpay_v1_description\":\"\",\"payment_methods_alternative_payment_method_zip_title\":\"Zip\",\"payment_methods_alternative_payment_method_zip_description\":\"\"}},\"widget_style\":{\"widget_style_bg_color\":\"#D9D9D9\",\"widget_style_text_color\":\"#000000\",\"widget_style_border_color\":\"#000000\",\"widget_style_error_color\":\"#51B97C\",\"widget_style_success_color\":\"#51B97C\",\"widget_style_font_size\":\"14px\",\"widget_style_font_family\":\"ui-rounded\",\"widget_style_custom_element\":\"\"}},\"saved_credentials\":{}}"
      }
   },
   ....
}
```



### Step-3: Make a payment

Submit a payment request by setting the `makePaymentRequest` custom field. The request should resemble the following:

```
{
   version:{paymentVersion},
   actions: [
      {
         action: "setCustomField",
         name: "makePaymentRequest",
         value: JSON.stringify({
            orderId: {reference}, //payment id
            paymentId: {paymentId}, //payment id
            amount: {
               currencyCode: "AUD",
               centAmount: 100
            },
            PaydockTransactionId: {paymentSource}, //TransactionId information from "paydock commercetools widget"
            PaydockPaymentStatus: {status},
            PaydockPaymentType: {paymentType},//{card| apel pay | google pay and etc..}
            CommerceToolsUserId: {commerceToolCustomerId},
            SaveCard: true|false,
            VaultToken: {vaultToken}, // token generated using "paydock commercetools widget"
            AdditionalInfo: { // information from checkout form
               country: {Country code},
               firstName: {First Name},
               lastName: {Last Name},
               streetName: {Atreet Name},
               additionalStreetInfo: {Additional street info},
               postalCode: {Additional street info},
               city: {city},
               phone: {phone},
               email: {email},
            }
         })
      }
   ]
}
```
The extension will process the charge via Paydock and return the payment and order status in the  `Payment Extension Response`  custom field.
```
{....
   custom: {
      type: {
         typeId: type,
         id: "31650638-42fc-439e-902e-199589009ed3"
      },
      fields: {
         PaydockTransactionId: "*****",
         CommercetoolsProjectKey: "{projectKey}",
         PaymentExtensionResponse:  "{\"orderPaymentStatus\":\"Pending\",\"orderStatus\":\"Open\"}"
     }
   },
   ....
}
```

## Step-4: Update payment status


To update the payment status, set the PaymentExtensionRequest custom field with an updatePaymentStatus action:
```
{
   version:{paymentVersion},
   actions: [
      {
         action: "setCustomField",
         name: "PaymentExtensionRequest",
         value: JSON.stringify({
            action: "updatePaymentStatus", 
            request: {
               orderId: "*********",
               newStatus":"{new_status}",
               newDate: "{date}"
            }
         })
      }
   ]
}
```
The request will be processing via help extension(update paydock status) and  will return in custom field `Payment Extension Response` status of operation (true| false).
```
{....
   custom: {
      type: {
         typeId: type,
         id: "31650638-42fc-439e-902e-199589009ed3"
      },
      fields: {
        PaymentExtensionResponse: '{"status":true}
     }
   },
   ....
}
```

# Test

To run tests, use the following command:

```
npm run test
```

## See also
- [Paydock Commercetools Widget](https://github.com/PayDock/e-commerce-commercetools-npm)
- [Paydock Commercetools Custom Application](https://github.com/PayDock/e-commerce-commercetools-app/)
- [Paydock website](https://paydock.com/)

## License

This repository is available under the [MIT license](LICENSE).
