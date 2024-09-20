import config from '../config/config.js'

const container = "paydock-storage";

async function getItem(key) {
    try {
        const ctpClient = await config.getCtpClient()
        const {body} = await ctpClient.fetchByContainerAndKey(ctpClient.builder.customObjects, container, key);
        return body.value;
    } catch (error) {
        return null;
    }
}

async function removeItem(key) {
    const ctpClient = await config.getCtpClient()
    await ctpClient.deleteByContainerAndKey(ctpClient.builder.customObjects, container, key)
}

export default {
    getItem,
    removeItem
}
