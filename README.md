# Paydock Payment Connector for commercetools

## Overview

The Paydock Payment Connector allows seamless integration between your commercetools platform and Paydock, enhancing your payment management processes. This repository contains three primary modules:
![Live Connection](docs/paydock-connector.png)

### Extension Module
Acts as middleware to connect commercetools with Paydock. It triggers on payment creation and updates within commercetools to ensure efficient event handling by Paydock.
- [Integration Guide](extension/docs/IntegrationGuide.md): Detailed steps to integrate this module with commercetools.
- [How to Run](extension/docs/HowToRun.md): Instructions for deploying and running the extension module.


### Merchant center custom application
This application allows you to configure both live and sandbox connections to Paydock. Additionally, you can view logs and orders processed through the Paydock payment system.
- [Integration Guide](merchant-center-custom-application/docs/IntegrationGuide.md): Information on integrating this custom application with commercetools.
- [How to Run](merchant-center-custom-application/docs/HowToRun.md): Instructions for deploying and running the merchant center custom application.

### Notification Module
Manages asynchronous notifications from Paydock about payment status changes (e.g., authorization, charge, refund). It updates the corresponding payment status in commercetools.
- [Integration Guide](notification/docs/IntegrationGuide.md): Information on integrating this module with commercetools.
- [How to Run](notification/docs/HowToRun.md): Instructions for deploying and running the notification module.

**Important**: Both modules are required to fully integrate your commercetools setup with Paydock.

Other guides
Follow the FAQ for the answers to frequently asked questions, such as order creation, deployment etc.
Follow the Contribution Guide if you would like to run modules locally.

## Additional Resources
- [Paydock Commercetools Widget](https://github.com/PayDock/e-commerce-commercetools-npm)
- [Official Paydock Website](https://paydock.com/)

## Contribution
Follow the Contribution Guide if you would like to run modules locally. [Contribution](docs/Contributing.md).

## License
This project is licensed under the [MIT License](LICENSE).