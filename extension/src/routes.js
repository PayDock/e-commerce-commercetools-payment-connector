import paymentController from './api/payment/payment.controller.js'

const routes = {
  '/extension': paymentController.processRequest
}

export { routes }
