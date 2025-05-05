const express = require('express');
const router = express.Router();
const Checkout = require('../app/controllers/checkoutController');

// Create an instance of the class
const CheckoutInstance = new Checkout();

// Define routes
router.post('/stripe-webhook-response', CheckoutInstance.webhookresponse);


module.exports = router;