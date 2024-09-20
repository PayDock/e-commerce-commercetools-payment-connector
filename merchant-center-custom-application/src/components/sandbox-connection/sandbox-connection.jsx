import React, { useState, useEffect } from 'react';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import Text from '@commercetools-uikit/text';
import PrimaryButton from '@commercetools-uikit/primary-button';
import SecondaryButton from '@commercetools-uikit/secondary-button';
import TextField from '@commercetools-uikit/text-field';
import PasswordField from '@commercetools-uikit/password-field';
import SelectField from '@commercetools-uikit/select-field';
import AsyncSelectField from '@commercetools-uikit/async-select-field';
import CollapsiblePanel from '@commercetools-uikit/collapsible-panel';
import Constraints from '@commercetools-uikit/constraints';
import Spacings from '@commercetools-uikit/spacings';
import messages from './messages';
import styles from './sandbox-connection.module.css';
import './sandbox-connection.css';
import { ContentNotification } from '@commercetools-uikit/notifications';
import PulseLoader from 'react-spinners/PulseLoader';
import CommerceToolsAPIAdapter from '../../commercetools-api-adaptor';
import ValidationPaydockData from '../../validation-paydock-data';
import { INITIAL_SANDBOX_CONNECTION_FORM } from '../../constants';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';

const SandboxConnectionForm = () => {
  const env = useApplicationContext(
    (context) => context.environment
  );
  const apiAdapter = new CommerceToolsAPIAdapter(env);

  const intl = useIntl();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const group = 'sandbox';
  const [id, setId] = useState(null);
  const [version, setVersion] = useState(null);
  const [createdAt, setCreatedAt] = useState(null);

  const sandbox_mode_options = [
    { value: 'Yes', label: 'Yes' },
    { value: 'No', label: 'No' },
  ];

  const credentials_type_options = [
    { value: 'credentials', label: 'Public & Secret Keys' },
    { value: 'access_key', label: 'Access Token' },
  ];

  const card_use_on_checkout_options = [
    { value: 'Yes', label: 'Yes' },
    { value: 'No', label: 'No' },
  ];

  const card_supported_card_schemes_options = [
    { value: 'ausbc', label: `Australian Bank Card` },
    {
      value: 'diners',
      label: 'Diner\'s Club, Diner\'s Club International, Diner\'s Club / Carte Blanche',
    },
    { value: 'japcb', label: 'Japanese Credit Bureau' },
    { value: 'laser', label: 'Laser' },
    { value: 'solo', label: 'Solo (Paymentech)' },
    { value: 'mastercard', label: 'MasterCard' },
    { value: 'discover', label: 'Discover' },
    { value: 'amex', label: 'American Express' },
    { value: 'visa', label: 'Visa, Visa Electron' },
    { value: 'visa_white', label: 'Visa White' },
  ];

  const card_3ds_options = [
    { value: 'Disable', label: 'Disable' },
    { value: 'Standalone 3DS', label: 'Standalone 3DS' },
    { value: 'In-built 3DS', label: 'In-built 3DS' },
  ];

  const card_3ds_flow_options = [
    { value: 'With vault', label: 'With vault' },
    { value: 'With OTT', label: 'With OTT' },
  ];

  const card_fraud_options = [
    { value: 'Disable', label: 'Disable' },
    { value: 'Standalone Fraud', label: 'Standalone Fraud' },
    { value: 'In-built Fraud', label: 'In-built Fraud' },
  ];

  const card_fraud_options_3ds_standalone = [
    { value: 'Disable', label: 'Disable' },
    { value: 'Standalone Fraud', label: 'Standalone Fraud' },
  ];

  const card_direct_charge_options = [
    { value: 'Disable', label: 'Disable' },
    { value: 'Enable', label: 'Enable' },
  ];

  const card_card_save_options = [
    { value: 'Disable', label: 'Disable' },
    { value: 'Enable', label: 'Enable' },
  ];

  const card_card_method_save_options = [
    { value: 'Vault token', label: 'Vault token' },
    { value: 'Customer with Gateway ID', label: 'Customer with Gateway ID' },
    { value: 'Customer without Gateway ID', label: 'Customer without Gateway ID' },
  ];

  const wallets_apple_pay_use_on_checkout_options = [
    { value: 'Yes', label: 'Yes' },
    { value: 'No', label: 'No' },
  ];

  const wallets_apple_pay_fraud_options = [
    { value: 'Disable', label: 'Disable' },
    { value: 'Enable', label: 'Enable' },
  ];

  const wallets_apple_pay_direct_charge_options = [
    { value: 'Disable', label: 'Disable' },
    { value: 'Enable', label: 'Enable' },
  ];

  const wallets_google_pay_use_on_checkout_options = [
    { value: 'Yes', label: 'Yes' },
    { value: 'No', label: 'No' },
  ];

  const wallets_google_pay_fraud_options = [
    { value: 'Disable', label: 'Disable' },
    { value: 'Enable', label: 'Enable' },
  ];

  const wallets_google_pay_direct_charge_options = [
    { value: 'Disable', label: 'Disable' },
    { value: 'Enable', label: 'Enable' },
  ];

  const wallets_paypal_smart_button_use_on_checkout_options = [
    { value: 'Yes', label: 'Yes' },
    { value: 'No', label: 'No' },
  ];

  const wallets_paypal_smart_button_fraud_options = [
    { value: 'Disable', label: 'Disable' },
    { value: 'Enable', label: 'Enable' },
  ];

  const wallets_paypal_smart_button_direct_charge_options = [
    { value: 'Disable', label: 'Disable' },
    { value: 'Enable', label: 'Enable' },
  ];

  const wallets_paypal_smart_button_pay_later_options = [
    { value: 'Disable', label: 'Disable' },
    { value: 'Enable', label: 'Enable' },
  ];

  const alternative_payment_methods_afterpay_v1_use_on_checkout_options = [
    { value: 'Yes', label: 'Yes' },
    { value: 'No', label: 'No' },
  ];

  const alternative_payment_methods_afterpay_v1_fraud_options = [
    { value: 'Disable', label: 'Disable' },
    { value: 'Enable', label: 'Enable' },
  ];


  const alternative_payment_methods_zippay_use_on_checkout_options = [
    { value: 'Yes', label: 'Yes' },
    { value: 'No', label: 'No' },
  ];

  const alternative_payment_methods_zippay_fraud_options = [
    { value: 'Disable', label: 'Disable' },
    { value: 'Enable', label: 'Enable' },
  ];

  const alternative_payment_methods_zippay_direct_charge_options = [
    { value: 'Disable', label: 'Disable' },
    { value: 'Enable', label: 'Enable' },
  ];

  const formik = useFormik({
    initialValues: INITIAL_SANDBOX_CONNECTION_FORM,
    onSubmit: async (values, formik) => {

      if (success) setSuccess(false);
      if (error) setError(false);
      setLoading(true);

      try {
        let result = await new ValidationPaydockData(false).validateConnections(values);
        if(!result.isValid){
          setError({message: result.errors.join(',')});
          setLoading(false);
        }else{
          apiAdapter.setConfigs(group, {
            id: id,
            version: version,
            createdAt: createdAt,
            value: values,
          })
            .then((response) => {
              setVersion(response.version ?? null);
              setId(response.id ?? null);
              setCreatedAt(response.createdAt ?? null);
              formik.setValues(response.value)

              setSuccess(true);
              setLoading(false);
            }).catch((error) => {
            setError({ message: error.message });
            setLoading(false);
          });
        }
      } catch (error) {
        setError({ message: error.message });
        formik.setErrors(error.data);
        setLoading(false);
      }
    },
    enableReinitialize: true,
  });


  const handleChange = (event) => {
    const { name, value } = event.target;

    if (name === 'card_3ds' && value === 'Standalone 3DS') {
      formik.setFieldValue('card_3ds_flow', formik.initialValues.card_3ds_flow);
      formik.setFieldValue('card_fraud', formik.initialValues.card_fraud);
    }

    if (name === 'card_fraud' && value === 'Standalone Fraud') {
      formik.setFieldValue('card_3ds_flow', formik.initialValues.card_3ds_flow);
    }

    if (name === 'card_3ds_flow' && value === 'With OTT') {
      formik.setFieldValue('card_card_save', formik.initialValues.card_card_save);
      formik.setFieldValue('card_card_method_save', formik.initialValues.card_card_method_save);
    }

    formik.handleChange(event);
  };

  const getConfig = () => {
    return apiAdapter.getConfigs(group).then((response) => {
      setVersion(response.version ?? null);
      setId(response.id ?? null);
      setCreatedAt(response.createdAt ?? null);

      if (response.value) {
        let merged = { ...formik.values, ...response.value };
        formik.setValues(merged);
      }
    });
  };

  useEffect(() => {
    getConfig().catch((error) => {
      if (404 === error.status) {
        apiAdapter.setConfigs(group, {
          id: null,
          version: null,
          createdAt: null,
          value: INITIAL_SANDBOX_CONNECTION_FORM,
        }).then(() => getConfig().catch((error) => {
          setError({ message: error.message });
        }));
      } else {
        setError({ message: error.message });
      }
    });
  }, []);

  return (
    <>
      <div className={styles.paySettingsHead}>
        <Text.Headline as="h1" intlMessage={messages.pageTitle} />
        <Text.Body intlMessage={messages.pageSubtitle} />

        <div className={styles.paySettingsButtonWrap}>
          {error && (
            <ContentNotification type="error">{error.message}</ContentNotification>
          )}
          {success && (
            <ContentNotification type="success">Your settings have been saved</ContentNotification>
          )}
          <div>
            {loading ? <PulseLoader color={'#36d7b7'} loading={loading} size={10} /> : (
              <>
                <SecondaryButton
                  onClick={(e) => {
                    formik.resetForm({ values: '' });
                    if (success) setSuccess(false);
                    if (error) setError(false);
                  }}
                  isDisabled={formik.isSubmitting}
                  label="Cancel"
                />
                <PrimaryButton
                  type="submit"
                  label="Save"
                  onClick={formik.handleSubmit}
                  isDisabled={formik.isSubmitting || !formik.dirty}
                />
              </>
            )}
          </div>
        </div>
      </div>

      <form onSubmit={formik.handleSubmit} onReset={formik.handleReset}>

        <SelectField
          name="sandbox_mode"
          title={intl.formatMessage(messages.selectSandboxModeTitle)}
          description={intl.formatMessage(messages.selectSandboxModeDesc)}
          isMulti={false}
          value={formik.values.sandbox_mode}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          options={sandbox_mode_options}
          isSearchable={false}
          isClearable={false}
        /><br />

        <CollapsiblePanel header="API Credential" isDefaultClosed={false} className="collapsible-panel">
          <Constraints.Horizontal max={'scale'}>
            <Spacings.Stack scale="xl">
              <SelectField
                name="credentials_type"
                title={intl.formatMessage(messages.credentialsTypeTitle)}
                isMulti={false}
                value={formik.values.credentials_type}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                options={credentials_type_options}
                isSearchable={false}
                isClearable={false}
              />

              {formik.values.credentials_type === 'credentials' && (
                <PasswordField
                  name="credentials_public_key"
                  title={intl.formatMessage(messages.credentialsPublicKeyTitle)}
                  description={intl.formatMessage(messages.credentialsPublicKeyDesc)}
                  value={formik.values.credentials_public_key}
                  touched={formik.touched.credentials_public_key}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isRequired={false}
                  errors={formik.errors.credentials_public_key}
                />
              )}

              {formik.values.credentials_type === 'credentials' && (
                <PasswordField
                  name="credentials_secret_key"
                  title={intl.formatMessage(messages.credentialsSecretKeyTitle)}
                  description={intl.formatMessage(messages.credentialsSecretKeyDesc)}
                  value={formik.values.credentials_secret_key}
                  touched={formik.touched.credentials_secret_key}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isRequired={false}
                  errors={formik.errors.credentials_secret_key}
                />
              )}

              {formik.values.credentials_type === 'access_key' && (
                <PasswordField
                  name="credentials_access_key"
                  title={intl.formatMessage(messages.credentialsAccessKeyTitle)}
                  description={intl.formatMessage(messages.credentialsAccessKeyDesc)}
                  value={formik.values.credentials_access_key}
                  touched={formik.touched.credentials_access_key}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isRequired={false}
                  errors={formik.errors.credentials_access_key}
                />
              )}
              {formik.values.credentials_type === 'access_key' && (
                <PasswordField
                  name="credentials_widget_access_key"
                  title={intl.formatMessage(messages.credentialsWidgetAccessKeyTitle)}
                  description={intl.formatMessage(messages.credentialsWidgetAccessKeyDesc)}
                  value={formik.values.credentials_widget_access_key}
                  touched={formik.touched.credentials_widget_access_key}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isRequired={false}
                  errors={formik.errors.credentials_widget_access_key}
                />
              )}
            </Spacings.Stack>
          </Constraints.Horizontal>
        </CollapsiblePanel>

        <CollapsiblePanel header="Cards" isDefaultClosed={true} className="collapsible-panel">
          <Constraints.Horizontal max={'scale'}>
            <Spacings.Stack scale="xl">

              <SelectField
                name="card_use_on_checkout"
                title={intl.formatMessage(messages.cardCheckoutTitle)}
                description={intl.formatMessage(messages.cardCheckoutDesc)}
                isMulti={false}
                value={formik.values.card_use_on_checkout}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                options={card_use_on_checkout_options}
                isSearchable={false}
                isClearable={false}
              />

              <AsyncSelectField
                name="card_supported_card_schemes"
                title={intl.formatMessage(messages.cardsSelectSupportedCard)}
                placeholder="Please select payment methods..."
                isMulti={true}
                value={formik.values.card_supported_card_schemes}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                defaultOptions={card_supported_card_schemes_options}
                loadOptions={(searchText) => {
                  card_supported_card_schemes_options;

                  return delay(250).then(() =>
                    card_supported_card_schemes_options.filter((item) =>
                      item.label
                        .toLowerCase()
                        .startsWith(searchText.toLowerCase()),
                    ),
                  );
                }}
                isSearchable={true}
                isClearable={true}
              />

              <TextField
                name="card_gateway_id"
                title={intl.formatMessage(messages.cardsGatewayId)}
                value={formik.values.card_gateway_id}
                touched={formik.touched.card_gateway_id}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isRequired={false}
                errors={formik.errors.card_gateway_id}
              />

              <SelectField
                name="card_3ds"
                title={intl.formatMessage(messages.cardsSelect3DS)}
                isMulti={false}
                value={formik.values.card_3ds}
                onChange={handleChange}
                onBlur={formik.handleBlur}
                options={card_3ds_options}
                isSearchable={false}
                isClearable={false}
              />

              {formik.values.card_3ds === 'Standalone 3DS' && (
                <TextField
                  name="card_3ds_service_id"
                  title={intl.formatMessage(messages.cards3DSservice)}
                  value={formik.values.card_3ds_service_id}
                  touched={formik.touched.card_3ds_service_id}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isRequired={false}
                  errors={formik.errors.card_3ds_service_id}
                />
              )}

              {formik.values.card_3ds === 'In-built 3DS' && formik.values.card_fraud !== 'Standalone Fraud' && (
                <SelectField
                  name="card_3ds_flow"
                  title={intl.formatMessage(messages.cards3DSflow)}
                  isMulti={false}
                  value={formik.values.card_3ds_flow}
                  onChange={handleChange}
                  onBlur={formik.handleBlur}
                  options={card_3ds_flow_options}
                  isSearchable={false}
                  isClearable={false}
                />
              )}

              {(formik.values.card_3ds === 'Standalone 3DS' || (formik.values.card_3ds === 'In-built 3DS' && formik.values.card_fraud === 'Standalone Fraud')) && (
                <TextField
                  name="card_3ds_flow"
                  title={intl.formatMessage(messages.cards3DSflow)}
                  value={formik.values.card_3ds_flow}
                  touched={formik.touched.card_3ds_flow}
                  onChange={handleChange}
                  onBlur={formik.handleBlur}
                  isRequired={false}
                  isReadOnly={true}
                />
              )}

              <SelectField
                name="card_fraud"
                title={intl.formatMessage(messages.cardsSelectFraud)}
                isMulti={false}
                value={formik.values.card_fraud}
                onChange={handleChange}
                onBlur={formik.handleBlur}
                options={formik.values.card_3ds === 'Standalone 3DS' ? card_fraud_options_3ds_standalone : card_fraud_options}
                isSearchable={false}
                isClearable={false}
              />

              {formik.values.card_fraud !== 'Disable' && (
                <TextField
                  name="card_fraud_service_id"
                  title={intl.formatMessage(messages.cardsFraudService)}
                  value={formik.values.card_fraud_service_id}
                  touched={formik.touched.card_fraud_service_id}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isRequired={false}
                  errors={formik.errors.card_fraud_service_id}
                />
              )}

              <SelectField
                name="card_direct_charge"
                title={intl.formatMessage(messages.cardsSelectDirectChargeTitle)}
                description={intl.formatMessage(messages.cardsSelectDirectChargeDescription)}
                isMulti={false}
                value={formik.values.card_direct_charge}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                options={card_direct_charge_options}
                isSearchable={false}
                isClearable={false}
              />

              {formik.values.card_3ds_flow !== 'With OTT' && (
                <SelectField
                  name="card_card_save"
                  title={intl.formatMessage(messages.cardsSelectSaveCardTitle)}
                  description={intl.formatMessage(messages.cardsSelectSaveCardDescription)}
                  isMulti={false}
                  value={formik.values.card_card_save}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  options={card_card_save_options}
                  isSearchable={false}
                  isClearable={false}
                />
              )}

              {formik.values.card_card_save !== 'Disable' && formik.values.card_3ds_flow !== 'With OTT' && (
                <SelectField
                  name="card_card_method_save"
                  title={intl.formatMessage(messages.cardsSelectSaveCardMethod)}
                  isMulti={false}
                  value={formik.values.card_card_method_save}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  options={card_card_method_save_options}
                  isSearchable={false}
                  isClearable={false}
                />
              )}

            </Spacings.Stack>
          </Constraints.Horizontal>
        </CollapsiblePanel>
        <CollapsiblePanel header="Wallets" isDefaultClosed={true} className="collapsible-panel">
          <Constraints.Horizontal max={'scale'}>
            <Spacings.Stack scale="xl">

              <CollapsiblePanel header="Apple pay" isDefaultClosed={true} className="collapsible-panel">
                <Constraints.Horizontal max={'scale'}>
                  <Spacings.Stack scale="xl">

                    <SelectField
                      name="wallets_apple_pay_use_on_checkout"
                      title={intl.formatMessage(messages.walletApplePayCheckoutTitle)}
                      description={intl.formatMessage(messages.walletApplePayCheckoutDesc)}
                      isMulti={false}
                      value={formik.values.wallets_apple_pay_use_on_checkout}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      options={wallets_apple_pay_use_on_checkout_options}
                      isSearchable={false}
                      isClearable={false}
                    />

                    <TextField
                      name="wallets_apple_pay_gateway_id"
                      title={intl.formatMessage(messages.walletApplePayGatewayId)}
                      value={formik.values.wallets_apple_pay_gateway_id}
                      touched={formik.touched.wallets_apple_pay_gateway_id}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      isRequired={false}
                      errors={formik.errors.wallets_apple_pay_gateway_id}
                    />

                    <SelectField
                      name="wallets_apple_pay_fraud"
                      title={intl.formatMessage(messages.walletApplePaySelectFraud)}
                      isMulti={false}
                      value={formik.values.wallets_apple_pay_fraud}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      options={wallets_apple_pay_fraud_options}
                      isSearchable={false}
                      isClearable={false}
                    />

                    {formik.values.wallets_apple_pay_fraud !== 'Disable' && (
                      <TextField
                        name="wallets_apple_pay_fraud_service_id"
                        title={intl.formatMessage(messages.walletApplePayFraudService)}
                        value={formik.values.wallets_apple_pay_fraud_service_id}
                        touched={formik.touched.wallets_apple_pay_fraud_service_id}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        isRequired={false}
                        errors={formik.errors.wallets_apple_pay_fraud_service_id}
                      />
                    )}

                    <SelectField
                      name="wallets_apple_pay_direct_charge"
                      title={intl.formatMessage(messages.walletApplePaySelectDirectChargeTitle)}
                      description={intl.formatMessage(messages.walletApplePaySelectDirectChargeDescription)}
                      isMulti={false}
                      value={formik.values.wallets_apple_pay_direct_charge}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      options={wallets_apple_pay_direct_charge_options}
                      isSearchable={false}
                      isClearable={false}
                    />

                  </Spacings.Stack>
                </Constraints.Horizontal>
              </CollapsiblePanel>

              <CollapsiblePanel header="Google pay" isDefaultClosed={true} className="collapsible-panel">
                <Constraints.Horizontal max={'scale'}>
                  <Spacings.Stack scale="xl">

                    <SelectField
                      name="wallets_google_pay_use_on_checkout"
                      title={intl.formatMessage(messages.walletGooglePayCheckoutTitle)}
                      description={intl.formatMessage(messages.walletGooglePayCheckoutDesc)}
                      isMulti={false}
                      value={formik.values.wallets_google_pay_use_on_checkout}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      options={wallets_google_pay_use_on_checkout_options}
                      isSearchable={false}
                      isClearable={false}
                    />

                    <TextField
                      name="wallets_google_pay_gateway_id"
                      title={intl.formatMessage(messages.walletGooglePayGatewayId)}
                      value={formik.values.wallets_google_pay_gateway_id}
                      touched={formik.touched.wallets_google_pay_gateway_id}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      isRequired={false}
                      errors={formik.errors.wallets_google_pay_gateway_id}
                    />

                    <SelectField
                      name="wallets_google_pay_fraud"
                      title={intl.formatMessage(messages.walletGooglePaySelectFraud)}
                      isMulti={false}
                      value={formik.values.wallets_google_pay_fraud}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      options={wallets_google_pay_fraud_options}
                      isSearchable={false}
                      isClearable={false}
                    />

                    {formik.values.wallets_google_pay_fraud !== 'Disable' && (
                      <TextField
                        name="wallets_google_pay_fraud_service_id"
                        title={intl.formatMessage(messages.walletGooglePayFraudService)}
                        value={formik.values.wallets_google_pay_fraud_service_id}
                        touched={formik.touched.wallets_google_pay_fraud_service_id}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        isRequired={false}
                        errors={formik.errors.wallets_google_pay_fraud_service_id}
                      />
                    )}

                    <SelectField
                      name="wallets_google_pay_direct_charge"
                      title={intl.formatMessage(messages.walletGooglePaySelectDirectChargeTitle)}
                      description={intl.formatMessage(messages.walletGooglePaySelectDirectChargeDescription)}
                      isMulti={false}
                      value={formik.values.wallets_google_pay_direct_charge}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      options={wallets_google_pay_direct_charge_options}
                      isSearchable={false}
                      isClearable={false}
                    />

                  </Spacings.Stack>
                </Constraints.Horizontal>
              </CollapsiblePanel>

              <CollapsiblePanel header="PayPal Smart Button" isDefaultClosed={true}
                                className="collapsible-panel">
                <Constraints.Horizontal max={'scale'}>
                  <Spacings.Stack scale="xl">

                    <SelectField
                      name="wallets_paypal_smart_button_use_on_checkout"
                      title={intl.formatMessage(messages.walletPAYPALCheckoutTitle)}
                      description={intl.formatMessage(messages.walletPAYPALCheckoutDesc)}
                      isMulti={false}
                      value={formik.values.wallets_paypal_smart_button_use_on_checkout}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      options={wallets_paypal_smart_button_use_on_checkout_options}
                      isSearchable={false}
                      isClearable={false}
                    />

                    <TextField
                      name="wallets_paypal_smart_button_gateway_id"
                      title={intl.formatMessage(messages.walletPAYPALGatewayId)}
                      value={formik.values.wallets_paypal_smart_button_gateway_id}
                      touched={formik.touched.wallets_paypal_smart_button_gateway_id}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      isRequired={false}
                      errors={formik.errors.wallets_paypal_smart_button_gateway_id}
                    />

                    <SelectField
                      name="wallets_paypal_smart_button_fraud"
                      title={intl.formatMessage(messages.walletPAYPALSelectFraud)}
                      isMulti={false}
                      value={formik.values.wallets_paypal_smart_button_fraud}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      options={wallets_paypal_smart_button_fraud_options}
                      isSearchable={false}
                      isClearable={false}
                    />

                    {formik.values.wallets_paypal_smart_button_fraud !== 'Disable' && (
                      <TextField
                        name="wallets_paypal_smart_button_fraud_service_id"
                        title={intl.formatMessage(messages.walletPAYPALFraudService)}
                        value={formik.values.wallets_paypal_smart_button_fraud_service_id}
                        touched={formik.touched.wallets_paypal_smart_button_fraud_service_id}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        isRequired={false}
                        errors={formik.errors.wallets_paypal_smart_button_fraud_service_id}
                      />
                    )}

                    <SelectField
                      name="wallets_paypal_smart_button_direct_charge"
                      title={intl.formatMessage(messages.walletPAYPALSelectDirectChargeTitle)}
                      description={intl.formatMessage(messages.walletPAYPALSelectDirectChargeDescription)}
                      isMulti={false}
                      value={formik.values.wallets_paypal_smart_button_direct_charge}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      options={wallets_paypal_smart_button_direct_charge_options}
                      isSearchable={false}
                      isClearable={false}
                    />

                    <SelectField
                      name="wallets_paypal_smart_button_pay_later"
                      title={intl.formatMessage(messages.walletPAYPALSelectPayLaterTitle)}
                      isMulti={false}
                      value={formik.values.wallets_paypal_smart_button_pay_later}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      options={wallets_paypal_smart_button_pay_later_options}
                      isSearchable={false}
                      isClearable={false}
                    />

                  </Spacings.Stack>
                </Constraints.Horizontal>
              </CollapsiblePanel>
            </Spacings.Stack>
          </Constraints.Horizontal>
        </CollapsiblePanel>


        <CollapsiblePanel header="Alternative Payment Methods" isDefaultClosed={true}
                          className="collapsible-panel">
          <Constraints.Horizontal max={'scale'}>
            <Spacings.Stack scale="xl">

              <CollapsiblePanel header="Afterpay v1" isDefaultClosed={true} className="collapsible-panel">
                <Constraints.Horizontal max={'scale'}>
                  <Spacings.Stack scale="xl">

                    <SelectField
                      name="alternative_payment_methods_afterpay_v1_use_on_checkout"
                      title={intl.formatMessage(messages.walletAfterpayCheckoutTitle)}
                      description={intl.formatMessage(messages.walletAfterpayCheckoutDesc)}
                      isMulti={false}
                      value={formik.values.alternative_payment_methods_afterpay_v1_use_on_checkout}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      options={alternative_payment_methods_afterpay_v1_use_on_checkout_options}
                      isSearchable={false}
                      isClearable={false}
                    />

                    <TextField
                      name="alternative_payment_methods_afterpay_v1_gateway_id"
                      title={intl.formatMessage(messages.walletAfterpayGatewayId)}
                      value={formik.values.alternative_payment_methods_afterpay_v1_gateway_id}
                      touched={formik.touched.alternative_payment_methods_afterpay_v1_gateway_id}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      isRequired={false}
                      errors={formik.errors.alternative_payment_methods_afterpay_v1_gateway_id}
                    />

                    <SelectField
                      name="alternative_payment_methods_afterpay_v1_fraud"
                      title={intl.formatMessage(messages.walletAfterpaySelectFraud)}
                      isMulti={false}
                      value={formik.values.alternative_payment_methods_afterpay_v1_fraud}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      options={alternative_payment_methods_afterpay_v1_fraud_options}
                      isSearchable={false}
                      isClearable={false}
                    />

                    {formik.values.alternative_payment_methods_afterpay_v1_fraud !== 'Disable' && (
                      <TextField
                        name="alternative_payment_methods_afterpay_v1_fraud_service_id"
                        title={intl.formatMessage(messages.walletAfterpayFraudService)}
                        value={formik.values.alternative_payment_methods_afterpay_v1_fraud_service_id}
                        touched={formik.touched.alternative_payment_methods_afterpay_v1_fraud_service_id}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        isRequired={false}
                        errors={formik.errors.alternative_payment_methods_afterpay_v1_fraud_service_id}
                      />
                    )}
                  </Spacings.Stack>
                </Constraints.Horizontal>
              </CollapsiblePanel>

              <CollapsiblePanel header="Zip" isDefaultClosed={true} className="collapsible-panel">
                <Constraints.Horizontal max={'scale'}>
                  <Spacings.Stack scale="xl">

                    <SelectField
                      name="alternative_payment_methods_zippay_use_on_checkout"
                      title={intl.formatMessage(messages.walletZippayCheckoutTitle)}
                      description={intl.formatMessage(messages.walletZippayCheckoutDesc)}
                      isMulti={false}
                      value={formik.values.alternative_payment_methods_zippay_use_on_checkout}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      options={alternative_payment_methods_zippay_use_on_checkout_options}
                      isSearchable={false}
                      isClearable={false}
                    />

                    <TextField
                      name="alternative_payment_methods_zippay_gateway_id"
                      title={intl.formatMessage(messages.walletZippayGatewayId)}
                      value={formik.values.alternative_payment_methods_zippay_gateway_id}
                      touched={formik.touched.alternative_payment_methods_zippay_gateway_id}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      isRequired={false}
                      errors={formik.errors.alternative_payment_methods_zippay_gateway_id}
                    />

                    <SelectField
                      name="alternative_payment_methods_zippay_fraud"
                      title={intl.formatMessage(messages.walletZippaySelectFraud)}
                      isMulti={false}
                      value={formik.values.alternative_payment_methods_zippay_fraud}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      options={alternative_payment_methods_zippay_fraud_options}
                      isSearchable={false}
                      isClearable={false}
                    />

                    {formik.values.alternative_payment_methods_zippay_fraud !== 'Disable' && (
                      <TextField
                        name="alternative_payment_methods_zippay_fraud_service_id"
                        title={intl.formatMessage(messages.walletZippayFraudService)}
                        value={formik.values.alternative_payment_methods_zippay_fraud_service_id}
                        touched={formik.touched.alternative_payment_methods_zippay_fraud_service_id}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        isRequired={false}
                        errors={formik.errors.alternative_payment_methods_zippay_fraud_service_id}
                      />
                    )}

                    <SelectField
                      name="alternative_payment_methods_zippay_direct_charge"
                      title={intl.formatMessage(messages.walletZippaySelectDirectChargeTitle)}
                      description={intl.formatMessage(messages.walletZippaySelectDirectChargeDescription)}
                      isMulti={false}
                      value={formik.values.alternative_payment_methods_zippay_direct_charge}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      options={alternative_payment_methods_zippay_direct_charge_options}
                      isSearchable={false}
                      isClearable={false}
                    />

                  </Spacings.Stack>
                </Constraints.Horizontal>
              </CollapsiblePanel>

            </Spacings.Stack>
          </Constraints.Horizontal>
        </CollapsiblePanel>

      </form>
    </>
  );
};

TextField.propTypes = {
  type: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
};

TextField.defaultProps = {
  type: 'text',
  value: '',
  placeholder: '',
};

SandboxConnectionForm.displayName = 'SandboxConnectionForm';

export default SandboxConnectionForm;
