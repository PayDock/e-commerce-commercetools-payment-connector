import { setupServer } from './server.js'
import logger  from './utils/logger.js'
import config from './config/config.js'

const server = setupServer()
const paydockLogger = logger.getLogger()

const moduleConfig = config.getModuleConfig()

const port = moduleConfig.port || 8080

if (moduleConfig.keepAliveTimeout !== undefined)
  server.keepAliveTimeout = moduleConfig.keepAliveTimeout
server.listen(port, async () => {
  paydockLogger.info(`Notification module is running at http://0.0.0.0:${port}`)
})
