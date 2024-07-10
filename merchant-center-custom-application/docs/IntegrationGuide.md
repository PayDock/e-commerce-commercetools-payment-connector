# Integration Guide

**Table of Contents**

- [Create Custom Application in Merchant Center](#create-custom-application-in-merchant-center)
- [Overview Pages](#overview-pages)
  - [Live Connection](#live-connection)
  - [Sandbox Connection](#sandbox-connection)
  - [Widget Configuration](#widget-configuration)
  - [Orders](#orders)
  - [Logs](#logs)
- [See Also](#see-also)
- [License](#license)

## Create Custom Application in Merchant Center

To create a Custom Application in the Merchant Center, follow these steps:

1. Navigate to the "Register a Custom Application" page.
2. Register a new application with the following values:
  - **Name:** For example, "Paydock App".
  - **entryPointUriPath:** For example, "paydock-app".
  - Additional fields as required.

Additionally, you will need to add the following pages:

- `/project_key/{entryPointUriPath}/liveconnection` - To set up a live connection (gateway, supported cards, fraud prevention, etc.) to the Paydock system.
- `/project_key/{entryPointUriPath}/sandboxconnection` - To set up a sandbox connection (gateway, supported cards, fraud prevention, etc.) to the Paydock system.
- `/project_key/{entryPointUriPath}/widgetconfiguration` - To customize the styles of the widget integrated into Sunrise and other frontend frameworks.
- `/project_key/{entryPointUriPath}/orders` - To manage orders processed through our payment system, such as changing order statuses.
- `/project_key/{entryPointUriPath}/logs` - To display and review logs for better transparency and troubleshooting.

![Register a Custom Application](regiser-app.png)

## Overview Pages

### Live Connection

Set up a live connection (gateway, supported cards, fraud prevention, etc.) to the Paydock system.

![Live Connection](live-configuration.png)

### Sandbox Connection

Set up a sandbox connection (gateway, supported cards, fraud prevention, etc.) to the Paydock system.

![Sandbox Connection](sandbox-configuration.png)

### Widget Configuration

Customize the styles of the widget integrated into Sunrise and other frontend frameworks.

![Widget Configuration](style-configuration.png)

### Orders

Manage orders processed through our payment system, such as changing order statuses.

![Orders](orders.png)

### Logs

Display and review logs for better transparency and troubleshooting.

![Logs](log.png)

## See Also

- [Paydock Commercetools Widget](https://github.com/PayDock/e-commerce-commercetools-npm)
- [Paydock Website](https://paydock.com/)

## License

This repository is available under the [MIT license](LICENSE).