import { serializeError } from 'serialize-error';
import loggers  from '@commercetools-backend/loggers';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'node:fs/promises';
import config from './config/config.js';

const { createApplicationLogger } = loggers;

let loggerInstance;

function getLogger() {
    if (!loggerInstance) {
         loggerInstance = createApplicationLogger({
            name: 'ctp-paydock-integration-extension',
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
        value: data,
    };

    const ctpClient = await config.getCtpClient();
    await ctpClient.create(
        ctpClient.builder.customObjects,
        JSON.stringify(logObject)
    );
}

function collectRequestData(request) {
    return new Promise((resolve) => {
        const data = [];

        request.on('data', (chunk) => {
            data.push(chunk);
        });

        request.on('end', () => {
            const dataStr = Buffer.concat(data).toString();
            resolve(dataStr);
        });
    });
}

function sendResponse({ response, statusCode = 200, headers, data }) {
    response.writeHead(statusCode, headers);
    response.end(JSON.stringify(data));
}

function handleUnexpectedPaymentError(paymentObj, err) {
    const errorStackTrace = `Unexpected error (Payment ID: ${paymentObj?.id}): ${JSON.stringify(serializeError(err))}`;
    getLogger().error(errorStackTrace);
    return {
        errors: [
            {
                code: 'General',
                message: err.message,
            },
        ],
    };
}

async function readAndParseJsonFile(pathToJsonFileFromProjectRoot) {
    const currentFilePath = fileURLToPath(import.meta.url);
    const currentDirPath = path.dirname(currentFilePath);
    const projectRoot = path.resolve(currentDirPath, '..');
    const pathToFile = path.resolve(projectRoot, pathToJsonFileFromProjectRoot);

    const fileContent = await fs.readFile(pathToFile);
    return JSON.parse(fileContent);
}

async function deleteElementByKeyIfExists(ctpClient, key) {
    try {
        const { body } = await ctpClient.fetchByKey(
            ctpClient.builder.extensions,
            key
        );
        if (body) {
            await ctpClient.delete(ctpClient.builder.extensions, body.id, body.version);
        }
        return body;
    } catch (err) {
        if (err.statusCode === 404) return null;
        throw err;
    }
}

export default {
    collectRequestData,
    sendResponse,
    getLogger,
    handleUnexpectedPaymentError,
    readAndParseJsonFile,
    addPaydockLog,
    deleteElementByKeyIfExists,
};
