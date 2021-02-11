const express = require('express');

const extractFile = require('../middleware/file');
const router = express.Router();
const vendorPurchaseOrderController = require('../controllers/vendor-purchase-order');
const checkAuth = require('../middleware/check-auth');


  router.use('/vendor-purchase-orders', vendorPurchaseOrderController.getAllVendorPurchaseOrders);
  
  router.post("/save-vendor-purchase-order",
  checkAuth, 
  extractFile, 
  vendorPurchaseOrderController.saveVendorPurchaseOrder);
  
  router.put("/update-vendor-purchase-order/:id",
  checkAuth, 
  extractFile,
  vendorPurchaseOrderController.updateVendorPurchaseOrder);
  
  router.delete("/delete-vendor-purchase-order/:id",
  checkAuth, 
  vendorPurchaseOrderController.deleteVendorPurchaseOrder);
  
  router.get("/vendor-purchase-order-get/:id", vendorPurchaseOrderController.getSingleVendorPurchaseOrder);

  module.exports = router;