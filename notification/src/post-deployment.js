import {serializeError} from "serialize-error";
import {setupNotificationResources} from './setup.js'

async function postDeployment() {
  try {
    await setupNotificationResources();
  } catch (error) {
    throw Error(`Error: ${JSON.stringify(serializeError(error))}`)
  }
}
export {
  postDeployment
};
