import {loadConfig} from './config-loader.js'
import ctpClientBuilder from "../ctp.js";

let config
let paydockConfig;
let ctpClient;

function getModuleConfig() {
    const extensionBaseUrl = process.env.CONNECT_SERVICE_URL ?? config.extensionBaseUrl;
    return {
        removeSensitiveData: true,
        port: config.port,
        logLevel: config.logLevel,
        apiExtensionBaseUrl: extensionBaseUrl,
        basicAuth: true,
        projectKey: config.projectKey,
        keepAliveTimeout: 30,
        addCommercetoolsLineIteprojectKey: false,
        generateIdempotencyKey: false
    }
}

async function getCtpClient() {
    if (!ctpClient) {
        ctpClient = await ctpClientBuilder.get(getExtensionConfig())
    }
    return ctpClient;
}
async function getPaydockApiUrl() {
    const paydockC = await getPaydockConfig('connection');
    return paydockC.api_url;
}

function getExtensionConfig() {
    return {
        clientId: config.clientId,
        clientSecret: config.clientSecret,
        projectKey: config.projectKey,
        apiUrl: config.apiUrl,
        authUrl: config.authUrl
    }
}


async function getPaydockConfig(type = 'all', disableCache = false) {
    if (!paydockConfig || disableCache) {
        ctpClient = await getCtpClient();
        const responsePaydockConfig = await ctpClient.fetchById(
            ctpClient.builder.customObjects,
            'paydockConfigContainer',
        )
        if (responsePaydockConfig.body.results) {
            paydockConfig = {};
            const results = responsePaydockConfig.body.results.sort((a, b) => {
                if (a.version > b.version) {
                    return 1;
                }
                return -1;

            });
            results.forEach((element) => {
                paydockConfig[element.key] = element.value;
            });
        }
    }
    switch (type) {
        case 'connection':
            if (paydockConfig['sandbox']?.sandbox_mode === 'Yes') {
                paydockConfig['sandbox'].api_url = config.paydockSandboxUrl
                return paydockConfig['sandbox'] ?? {};
            }
            paydockConfig['live'].api_url =  config.paydockLiveUrl;
            return paydockConfig['live'] ?? {};

        case 'widget:':
            return paydockConfig['live'] ?? {};
        default:
            return paydockConfig
    }

}


function loadAndValidateConfig() {
    config = loadConfig()
    if (!config.clientId || !config.clientSecret) {
        throw new Error(
            `[ CTP project credentials are missing. ` +
            'Please verify that all projects have projectKey, clientId and clientSecret',
        )
    }
}

loadAndValidateConfig()

export default {
    getModuleConfig,
    getPaydockConfig,
    getCtpClient,
    getExtensionConfig,
    getPaydockApiUrl,
    loadAndValidateConfig
}
