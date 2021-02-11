const express = require('express');

const extractFile = require('../middleware/file');
const router = express.Router();
const metaDataController = require('../controllers/meta-data');
const checkAuth = require('../middleware/check-auth');


router.use('/get', metaDataController.getMetaData);

router.use('/get-vendor-payment', metaDataController.getVendorPaymentMetaData);
  

module.exports = router;