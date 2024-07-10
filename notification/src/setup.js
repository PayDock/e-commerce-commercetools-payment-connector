import config from './config/config.js'

async function setupNotificationResources() {
    const moduleConfig = await config.getModuleConfig()
    const ctpClient = await config.getCtpClient()
    if(moduleConfig.apiNotificationnBaseUrl) {
        createCustomObjectNotificationUrl(ctpClient, moduleConfig.apiNotificationnBaseUrl)
    }
}



async function createCustomObjectNotificationUrl(ctpClient, notificationUrl) {

    const objectNotificationUrlDraft = {
            container: "paydock-notification",
            key: "url",
            value: notificationUrl
        };
    await ctpClient.create(ctpClient.builder.customObjects, objectNotificationUrlDraft)
}

export {
    setupNotificationResources
}


