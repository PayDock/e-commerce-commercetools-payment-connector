const axios = require('axios');

class ValidationPaydockData {
    constructor(isLive = true) {
        this.apiUrl = isLive ? 'https://api.paydock.com' : 'https://api-sandbox.paydock.com';
    }

    async validateConnections(form) {
        const result = {
            isValid: true,
            errors: []
        };

        try {
            let servicesIds = await this.validateCredentials(form, 'access_key' === form.credentials_type);
            result.errors = this.validateGateways(form, servicesIds);
        } catch (error) {
            result.errors.push(error.message)
        }
        result.isValid = !result.errors.length;

        return result;
    }

    validateGateways(form, servicesId) {
        let errors = [];

        for (let key in form) {
            if (
              key.includes('gateway_id')
              && ('Yes' === form[key.replace('gateway_id', 'use_on_checkout')])
              && !servicesId.gatewayIds.includes(form[key])
            ) {
                errors.push('Incorrect gateway id for: ' + key.replace('_gateway_id', '')
                  .replace('_', ' '));
            }
            if (
              key.includes('fraud_service_id')
              && ('Enable' === form[key.replace('_service_id', '')])
              && !servicesId.servicesIds.includes(form[key])
            ) {
                errors.push('Incorrect fraud service id for: ' + key.replace('_fraud_service_id', '')
                  .replace('_', ' '));
            }
            if(key.includes('fraud_service_id')
              && ('Enable' === form[key.replace('_service_id', '')])
              && servicesId.servicesIds.includes(form[key])
              && (key.includes('afterpay') || key.includes('zip'))
              && servicesId.fraudServices[form[key]]
            ){
                errors.push('Fraud service mode is not supported with ' + key.replace('_fraud_service_id', '')
                  .replace('alternative_payment_methods_', ' ')
                  .replace('_',' '));
            }

            if (
              key.includes('3ds_service_id')
              && ('Enable' === form[key.replace('_service_id', '')])
              && !servicesId.servicesIds.includes(form[key])
            ) {
                errors.push('Incorrect 3ds service id.');
            }
        }

        return errors;
    }

    async validateCredentials(form, isToken = false) {
        try {
            let publicKey = isToken ? form.credentials_widget_access_key : form.credentials_public_key;
            let secret = isToken ? form.credentials_access_key : form.credentials_secret_key;
            await this.validatePublicKey(publicKey, isToken);

            return await this.validateSecretKey(secret, isToken);
        } catch (error) {
            throw new Error(error.message || 'Invalid Credentials.')
        }
    }


    async validateSecretKey(secretKey, isToken = false) {
        try {
            let config = {
                headers: {
                    'Content-Type': 'application/json',
                }
            }

            config.headers[isToken ? 'x-access-token' : 'x-user-secret-key'] = secretKey;

            let gateways = await axios.get(`${this.apiUrl}/v1/gateways?limit=1000`, config);
            let services = await axios.get(`${this.apiUrl}/v1/services?limit=1000`, config);
            let fraudServices = {}

            return {
                gatewayIds: gateways.data.resource.data.map((element) => element._id),
                servicesIds: services.data.resource.data.map((element) => {
                    if('fraud' === element.group){
                        fraudServices[element._id] = "passive" !== element.fraud_options.mode
                    }
                    return element._id;
                }),
                fraudServices,
            }
        } catch (error) {
            throw new Error(error.response?.data?.message || error.message || 'Unavailable API service.');
        }
    }

    async validatePublicKey(publicKey, isToken = false) {
        let config = {
            headers: {
                'Content-Type': 'application/json',
            }
        }

        config.headers[isToken ? 'x-access-token' : 'x-user-public-key'] = publicKey;

        return axios.post(`${this.apiUrl}/v1/payment_sources/tokens`, {
            gateway_id: '',
            type: ''
        }, config);
    }
}

export default ValidationPaydockData;
