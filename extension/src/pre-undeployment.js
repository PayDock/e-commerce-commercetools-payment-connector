import {serializeError} from "serialize-error";
import {cleanupExtensionResources} from './setup.js'

async function preUndeployment() {
    try {
        await cleanupExtensionResources();
    } catch (err) {
        throw Error(`Error: ${JSON.stringify(serializeError(err))}`)
    }
}

export {
    preUndeployment
};