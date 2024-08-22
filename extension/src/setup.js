import {serializeError} from "serialize-error";
import config from './config/config.js'
import ctpClientBuilder from './ctp.js'
import utils from './utils.js'
import {initResources} from './config/init/resources.js'
import {generateBasicAuthorizationHeaderValue} from './validator/authentication.js'

const logger = utils.getLogger()

async function setupExtensionResources() {
  const moduleConfig = config.getModuleConfig()
  const ctpConfig = config.getExtensionConfig()
  const ctpClient = await ctpClientBuilder.get(ctpConfig)
  await Promise.all(
      await initResources(
          ctpClient,
          ctpConfig.projectKey,
          moduleConfig.apiExtensionBaseUrl,
          generateBasicAuthorizationHeaderValue(),
      )
  )
  logger.info(
      `Configured commercetools project keys are: ${JSON.stringify(
          ctpConfig,
      )}. `,
  )
}

async function cleanupExtensionResources() {
  try {
    const ctpConfig = config.getExtensionConfig()
    const ctpClient = await ctpClientBuilder.get(ctpConfig)
    const apiExtensionTemplate = await utils.readAndParseJsonFile(
        'resources/api-extension.json',
    )
    const apiExtensionOrderTemplate = await utils.readAndParseJsonFile(
        'resources/api-order-extension.json',
    )
    await utils.deleteElementByKeyIfExists(ctpClient, apiExtensionTemplate.key)
    await utils.deleteElementByKeyIfExists(ctpClient, apiExtensionOrderTemplate.key)
  } catch (err) {
    throw Error(`Error: ${JSON.stringify(serializeError(err))}`)
  }
}

export {
  setupExtensionResources,
  cleanupExtensionResources
}
