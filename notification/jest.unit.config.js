export default {
    "roots": [
        "<rootDir>/src",
        "<rootDir>/tests"
    ],
    transformIgnorePatterns:
        [
            '//node_modules'
        ],
    displayName: 'Tests Javascript Application - Paydock Extension',
    moduleDirectories: ['node_modules', 'src'],
    testMatch: ['**/tests/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[tj]s?(x)'],
    testEnvironment: 'node',
};