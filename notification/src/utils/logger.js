import loggers  from '@commercetools-backend/loggers';
import config from '../config/config.js';

const { createApplicationLogger } = loggers;

let loggerInstance;

function getLogger() {
    if (!loggerInstance) {
        loggerInstance = createApplicationLogger({
            name: 'ctp-paydock-integration-notifications',
            level: config.getModuleConfig()?.logLevel || 'info',
        });
    }
    return loggerInstance;
}

async function addPaydockLog(data) {
    const logKey = `paydock-log_${Date.now()}`;
    const logObject = {
        container: "paydock-logs",
        key: logKey,
        value: data
    };

    const ctpClient = await config.getCtpClient();
    await ctpClient.create(
        ctpClient.builder.customObjects,
        JSON.stringify(logObject)
    );
}

export { getLogger, addPaydockLog };
