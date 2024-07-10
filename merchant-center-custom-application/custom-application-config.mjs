const config = {
    name: 'paydock-app',
    entryPointUriPath: '${env:ENTRY_POINT_URI_PATH}',
    cloudIdentifier: '${env:CLOUD_IDENTIFIER}',
    env: {
        development: {
            initialProjectKey: '${env:APP_PROJECT_KEY}',
        },
        production: {
            applicationId: '${env:CUSTOM_APPLICATION_ID}',
            url: '${env:APPLICATION_URL}',
        },
    },
    additionalEnv: {
        clientId: '${env:APP_CLIENT_ID}',
        clientSecret: '${env:APP_CLIENT_SECRET}',
        projectKey: '${env:APP_PROJECT_KEY}',
        region: '${env:APP_REGION}'
    },
    oAuthScopes: {
        view: [],
        manage: [],
    },
    icon: '${path:@commercetools-frontend/assets/application-icons/rocket.svg}',
    mainMenuLink: {
        defaultLabel: 'Paydock Settings',
        uriPath: '${env:CLOUD_IDENTIFIER}',
        labelAllLocales: [
            { locale: 'en',  value: 'Paydock Settings'},
            { locale: 'de',  value: 'Paydock Settings'}
        ],
        permissions: [],
    },
    submenuLinks: [
        {
            uriPath: 'liveconnection',
            defaultLabel: 'Live Connection',
            labelAllLocales: [
                { locale: 'en', value: 'Live Connection' },
                { locale: 'de', value: 'Live Connection' }
            ],
            permissions: [],
        },
        {
            uriPath: 'widgetconfiguration',
            defaultLabel: 'Widget Configuration',
            labelAllLocales: [
                { locale: 'en',  value: 'Widget Configuration' },
                { locale: 'de', value: 'Widget Configuration' }
            ],
            permissions: [],
        },
        {
            uriPath: 'sandboxconnection',
            defaultLabel: 'Sandbox Connection',
            labelAllLocales: [
                { locale: 'en',  value: 'Sandbox Connection' },
                { locale: 'de',  value: 'Sandbox Connection' }
            ],
            permissions: [],
        },
        {
            uriPath: 'log',
            defaultLabel: 'Log',
            labelAllLocales: [
                { locale: 'en',  value: 'Log' },
                { locale: 'de',  value: 'Log' }
            ],
            permissions: [],
        },
        {
            uriPath: 'orders',
            defaultLabel: 'Orders',
            labelAllLocales: [
                { locale: 'en',  value: 'Orders' },
                { locale: 'de',  value: 'Orders' }
            ],
            permissions: [],
        },
    ],
    headers: {
        csp: {
            'connect-src': [
                '\'self\'',
                'https://api.europe-west1.gcp.commercetools.com',
                '${env:APPLICATION_URL}',
                'https://auth.europe-west1.gcp.commercetools.com/oauth/token',
                'https://auth.europe-west1.gcp.commercetools.com',
                'https://mc-api.europe-west1.gcp.commercetools.com/graphql',
                'https://jsp-test-six.vercel.app',
                'https://mc-api.europe-west1.gcp.commercetools.com',
                'https://api.paydock-commercetool-app.jetsoftpro.dev',
                'http://localhost:3003',
                'http://localhost:3001',
                'https://api-sandbox.paydock.com',
                'https://api.paydock.com'
            ],
            'script-src': [
                '\'self\'',
                '\'unsafe-inline\'',
                '\'unsafe-eval\'',
                'https://api.europe-west1.gcp.commercetools.com',
                '${env:APPLICATION_URL}',
                'https://auth.europe-west1.gcp.commercetools.com/oauth/token',
                'https://auth.europe-west1.gcp.commercetools.com',
                'https://mc-api.europe-west1.gcp.commercetools.com/graphql',
                'https://mc-api.europe-west1.gcp.commercetools.com',
                'https://api.paydock-commercetool-app.jetsoftpro.dev',
                'https://jsp-test-six.vercel.app',
                'http://localhost:3001',
                'http://localhost:3003',
                'https://api-sandbox.paydock.com',
                'https://api.paydock.com'
            ],
            'style-src': [
                '\'self\'',
                '\'unsafe-inline\'',
                'https://fonts.googleapis.com'
            ],
            'img-src': [
                '\'self\'',
                'data:',
                'https:'
            ],
            'font-src': [
                '\'self\'',
                'https://fonts.gstatic.com'
            ],
            'frame-src': [
                '\'self\'',
                'https://api.europe-west1.gcp.commercetools.com',
                '${env:APPLICATION_URL}',
                'https://auth.europe-west1.gcp.commercetools.com/oauth/token',
                'https://auth.europe-west1.gcp.commercetools.com',
                'https://jsp-test-six.vercel.app',
                'http://localhost:3003',
                'http://localhost:3001',
                'https://api-sandbox.paydock.com',
                'https://api.paydock.com'
            ],
        },
    },
};

export default config;