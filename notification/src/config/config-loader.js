import { config } from "dotenv";

const requiredEnvVars = [
  'COMMERCETOOLS_CLIENT_ID',
  'COMMERCETOOLS_CLIENT_SECRET',
  'SECRET_KEY_FOR_ENCRYPTION',
  'COMMERCETOOLS_PROJECT_KEY',
  'COMMERCETOOLS_API_URL',
  'COMMERCETOOLS_AUTH_URL',
  'PAYDOCK_API_LIVE_URL',
  'PAYDOCK_API_SANDBOX_URL'
];

function loadConfig() {
  config();
  if (requiredEnvVars.every(varName => process.env[varName])) {
    return loadFromPaydockIntegrationEnvVar();
  }
  return {};
}

function loadFromPaydockIntegrationEnvVar() {
  const envConfig = {
    clientId: process.env.COMMERCETOOLS_CLIENT_ID,
    clientSecret: process.env.COMMERCETOOLS_CLIENT_SECRET,
    secretKeyForEncryption: process.env.SECRET_KEY_FOR_ENCRYPTION,
    projectKey: process.env.COMMERCETOOLS_PROJECT_KEY,
    apiUrl: process.env.COMMERCETOOLS_API_URL,
    authUrl: process.env.COMMERCETOOLS_AUTH_URL,
    paydockSandboxUrl: process.env.PAYDOCK_API_SANDBOX_URL,
    paydockLiveUrl: process.env.PAYDOCK_API_LIVE_URL
  };
  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
  }

  return envConfig;
}

export { loadConfig };
