import config from '../config/config.js'


function hasValidAuthorizationHeader(authTokenString) {
  const ctpConfig = config.getExtensionConfig()
  if (!authTokenString || authTokenString.indexOf(' ') < 0) return false
  const encodedAuthToken = authTokenString.split(' ')
  const decodedAuthToken = Buffer.from(encodedAuthToken[1], 'base64').toString()
  const credentialString = decodedAuthToken.split(':')
  const username = credentialString[0]
  const password = credentialString[1]
  return (
      ctpConfig.clientId === username &&
      ctpConfig.clientSecret === password
  )
}

function getAuthorizationRequestHeader(request) {
  return request?.headers?.['authorization']
}

function generateBasicAuthorizationHeaderValue() {
  const ctpConfig = config.getExtensionConfig()
  if (
      ctpConfig?.clientId &&
      ctpConfig?.clientSecret
  ) {
    const username = ctpConfig.clientId
    const password = ctpConfig.clientSecret

    const decodedAuthToken = `${username}:${password}`
    return `Basic ${Buffer.from(decodedAuthToken).toString('base64')}`
  }
  return null
}

export {
  hasValidAuthorizationHeader,
  getAuthorizationRequestHeader,
  generateBasicAuthorizationHeaderValue
}
