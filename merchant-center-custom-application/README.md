# Paydock Commercetools Custom Application

This guide provides instructions on how to install and set up the "Paydock" custom application for Commercetools.



## Prerequisites
Before you begin, ensure you have met the following requirements:

- [ ] Node.js (version 14 or higher) and npm installed on your machine
- [ ] Commercetools account with the necessary API credentials
- [ ] Git installed on your machine


## Installation

Follow these steps to install the custom application:

### 1 . Clone the repository

Open your terminal and run the following command to clone the repository:

```
git clone https://github.com/PayDock/e-commerce-commercetools-app
```

Navigate to the project directory:

```
cd e-commerce-commercetools-app
```

### 2 . Install dependencies

Run the following command to install the necessary dependencies:
```
npm install
```

### 3 . Configuration

Create a .env file in the root directory of the project and add the following environment variables with your Commercetools API credentials:
```
APP_CLIENT_ID=""
APP_CLIENT_SECRET="***"
APP_PROJECT_KEY="***"
APP_REGION="europe-west1.gcp"
```
Replace the placeholder values with your actual Commercetools API credentials.

### 4 . Run the application
Start the application by running the following command:
```
npm start
```

The application should now be running on http://your_domain:3000.

## Usage
To use the custom application:

1. Open your browser and navigate to http://your_domain:3000.
2. Log in with your Commercetools account credentials.
3. Follow the on-screen instructions to use the application features.


## License
This project is licensed under the MIT License. See the [LICENSE](https://rem.mit-license.org/+MIT)  file for details.

## Contact
If you have any questions or need further assistance, please contact [Professional Services](https://paydock.com/) .
