import { config } from "dotenv";

const requiredEnvVars = [
  'COMMERCETOOLS_CLIENT_ID',
  'COMMERCETOOLS_CLIENT_SECRET',
  'COMMERCETOOLS_PROJECT_KEY',
  'COMMERCETOOLS_API_URL',
  'COMMERCETOOLS_AUTH_URL',
  'PAYDOCK_API_LIVE_URL',
  'PAYDOCK_API_LIVE_URL'
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
    projectKey: process.env.COMMERCETOOLS_PROJECT_KEY,
    apiUrl: process.env.COMMERCETOOLS_API_URL,
    authUrl: process.env.COMMERCETOOLS_AUTH_URL,
    paydockSandboxUrl: process.env.PAYDOCK_API_SANDBOX_URL,
    paydockLiveUrl: process.env.PAYDOCK_API_LIVE_URL,
    notificationBaseUrl: process.env.NOTIFICATION_BASE_URL
  };
  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
  }

  return envConfig;
}

export { loadConfig };
