import {serializeError} from "serialize-error";
import {setupExtensionResources} from './setup.js'

async function postDeployment() {
  try {
    await setupExtensionResources();
  } catch (error) {
    throw Error(`Error: ${JSON.stringify(serializeError(error))}`)
  }
}
export {
  postDeployment
};
