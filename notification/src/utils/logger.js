import loggers from '@commercetools-backend/loggers';
import config from '../config/config.js';

const {createApplicationLogger} = loggers;

let loggerInstance;
let logActions = [];

function getLogger() {
    if (!loggerInstance) {
        loggerInstance = createApplicationLogger({
            name: 'ctp-paydock-integration-notifications',
            level: config.getModuleConfig()?.logLevel || 'info',
        });
    }
    return loggerInstance;
}

function addPaydockLog(data) {
    const date = new Date();
    let message = '';
    if (typeof data.message === 'string'){
        message = data.message
    }else{
        message = data?.message?.message ?? ''
    }
    logActions.push({
        "action": "addInterfaceInteraction",
        "type": {
            "key": "paydock-payment-log-interaction"
        },
        "fields": {
            "createdAt": date.toISOString(),
            "chargeId": data.paydockChargeID,
            "operation": data.operation,
            "status": data.status,
            "message": message
        }
    })
}

function getLogActions(){
    const result = logActions
    logActions = [];

    return result;
}

export {getLogger, addPaydockLog, getLogActions};
