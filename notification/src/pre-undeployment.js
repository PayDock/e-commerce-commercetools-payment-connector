import {serializeError} from "serialize-error";
import {cleanupNotificationResources} from './setup.js'

async function preUndeployment() {
    try {
        await cleanupNotificationResources();
    } catch (err) {
        throw Error(`Error: ${JSON.stringify(serializeError(err))}`)
    }
}

export {
    preUndeployment
};