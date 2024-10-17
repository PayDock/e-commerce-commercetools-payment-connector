import loggers from '@commercetools-backend/loggers';
import config from '../config/config.js';

const {createApplicationLogger} = loggers;


function getLogger() {
    return createApplicationLogger({
        name: 'ctp-paydock-integration-extension',
        level: config.getModuleConfig()?.logLevel || 'info',
    });
}

function createLogContext(paymentId, httpRequestId) {
    let logActions = [];

    function addPaydockLog(data) {
        const date = new Date();
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
                "message": data.message,
                "paymentId": paymentId,  // Ідентифікатор платежу
                "httpRequestId": httpRequestId  // Ідентифікатор HTTP-запиту
            }
        });
    }

    function clearLog() {
        logActions = [];
    }

    function getLogsAction() {
        const result = logActions;
        clearLog();  // Очищуємо після отримання логів
        return result;
    }

    return {
        addPaydockLog,
        getLogsAction,
        clearLog
    };
}

export default {getLogger, createLogContext};
