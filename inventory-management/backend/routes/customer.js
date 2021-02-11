const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customer');

router.post("/signup", customerController.createCustomer);

router.post("/login", customerController.customerLogin);


module.exports = router;