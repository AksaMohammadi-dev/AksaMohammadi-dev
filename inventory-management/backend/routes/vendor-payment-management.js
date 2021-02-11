const express = require('express');

const extractFile = require('../middleware/file');
const router = express.Router();
const vendorPaymentManagementController = require('../controllers/vendor-payment-management');
const checkAuth = require('../middleware/check-auth');


  router.use('/vendor-payment-managements', vendorPaymentManagementController.getAllVendorPaymentManagements);
  
  router.post("/save-vendor-payment-management",
  checkAuth, 
  extractFile, 
  vendorPaymentManagementController.saveVendorPaymentManagement);
  
  router.put("/update-vendor-payment-management/:id",
  checkAuth, 
  extractFile,
  vendorPaymentManagementController.updateVendorPaymentManagement);
  
  router.delete("/delete-vendor-payment-management/:id",
  checkAuth, 
  vendorPaymentManagementController.deleteVendorPaymentManagement);
  
  router.get("/get-vendor-payment-management/:id", vendorPaymentManagementController.getSingleVendorPaymentManagement);

  module.exports = router;