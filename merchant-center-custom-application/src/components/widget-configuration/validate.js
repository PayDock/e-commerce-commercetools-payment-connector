import TextInput from '@commercetools-uikit/text-input';

const validate = (values) => {
  const errors = {};

  if (TextInput.isEmpty(values.payment_methods_cards_title)) {
    errors.payment_methods_cards_title = {missing: true};
  }
  if (TextInput.isEmpty(values.payment_methods_wallets_apple_pay_title)) {
    errors.payment_methods_wallets_title = {missing: true};
  }

  if (TextInput.isEmpty(values.payment_methods_wallets_google_pay_title)) {
    errors.payment_methods_wallets_title = {missing: true};
  }

  if (TextInput.isEmpty(values.payment_methods_wallets_paypal_title)) {
    errors.payment_methods_wallets_title = {missing: true};
  }

  if (TextInput.isEmpty(values.payment_methods_alternative_payment_method_afterpay_v1_title)) {
    errors.payment_methods_wallets_title = {missing: true};
  }

  if (TextInput.isEmpty(values.payment_methods_alternative_payment_method_zip_title)) {
    errors.payment_methods_wallets_title = {missing: true};
  }

  return errors;
};

export default validate;
