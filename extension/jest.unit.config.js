export default {
    "roots": [
        "<rootDir>/src",
        "<rootDir>/tests"
    ],
    transformIgnorePatterns:
        [
            '//node_modules'
        ],
    collectCoverageFrom: [
        'src/**/*.{js,jsx,ts,tsx}',
    ],
    modulePathIgnorePatterns: [
        "<rootDir>/src/config/",
        "<rootDir>/src/validator/error-messages.js",
    ],
    coveragePathIgnorePatterns: [
        "<rootDir>/src/config/",
        "<rootDir>/src/validator/error-messages.js",
    ],
    testPathIgnorePatterns: [
        "<rootDir>/src/config/",
        "<rootDir>/src/validator/error-messages.js",
    ],
    displayName: 'Tests Javascript Application - Paydock Extension',
    moduleDirectories: ['node_modules', 'src'],
    testMatch: ['**/tests/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[tj]s?(x)'],
    testEnvironment: 'node',
};