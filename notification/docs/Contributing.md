## Contribution Guide

We welcome contributions to the project! If you're interested in contributing, please follow the steps below.

### Minimum Requirements
Before you begin, ensure you have the following installed:

- **Node.js**: Version 18 or higher
- **npm**: Version 6 or higher

### Installation

To contribute or run the services locally, follow these steps:

1. **Clone the Repository:**

   First, clone the repository to your local machine:

   ```bash
   git clone https://github.com/PayDock/e-commerce-commercetools-payment-connector
   ```
2. **Navigate to the conector directory:**
   ```bash
   cd e-commerce-commercetools-payment-connector
   ```


3. **Navigate to the service directory (either `extension`, `notification`, or `merchant-center-custom-application`) depending on which module you're working on.**


4. **Once inside the desired directory, run the following command to install the necessary dependencies:**

    ```bash
    npm install
    ```

   For example, to install dependencies for the `extension` module, use the following:
    ```bash
    cd extension
    npm install
    ```

### Running the Service

To start any of the services locally, follow these steps:

1. **Navigate to the service directory (`extension`, `notification`, or `merchant-center-custom-application`).**

    ```bash
    cd extension/notification/merchant-center-custom-application
    ```

2. **Run the service using the following command:**

    ```bash
    npm run start
    ```

   This will start the service locally, allowing you to interact with it during development.

### Running Tests

To ensure everything is working correctly, you should run the provided tests. Follow these steps to run the tests for any module:

1. **Navigate to the relevant service directory (e.g., `extension` or `notification`).**

    ```bash
    cd extension/notification
    ```

2. **Run the following command to execute the tests:**

    ```bash
    npm run test
    ```

### Generating HTML Coverage Report

To check the test coverage for your code, you can generate an HTML coverage report. This report will provide detailed information about which parts of the code are covered by tests and which are not.

1. **Navigate to the service directory:**

    ```bash
    cd extension/notification
    ```

2. **Run the following command to generate the coverage report:**

    ```bash
    npm run jest-coverage
    ```

   This command will run the tests and create a coverage report in HTML format, which can be viewed in a browser.

### Guidelines for Contributions

Please follow these guidelines when contributing:

- **Code Standards**: Ensure that your code follows the style and standards of the existing codebase.
- **Write Tests**: Add or update tests to verify that your code works as expected.
- **Commit Messages**: Use clear and concise commit messages that describe the changes made.
- **Pull Requests**: When your changes are ready, open a pull request. Ensure your pull request is descriptive and references any relevant issues.