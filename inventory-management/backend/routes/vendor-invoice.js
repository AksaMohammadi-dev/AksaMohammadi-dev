const express = require('express');

const extractFile = require('../middleware/file');
const router = express.Router();
const vendorController = require('../controllers/vendor-invoice');
const checkAuth = require('../middleware/check-auth');


  router.use('/vendor-invoices', vendorController.getAllVendorInvoices);

  router.use('/vendor-invoice-details/:id', vendorController.getVendorInvoiceDetail);

  router.use('/vendor-invoice-product-details/:vendorInvoiceDetailId', vendorController.getAllVendorInvoiceProductDetail);
  
  router.post("/vendor-invoice-save",
  checkAuth, 
  extractFile, 
  vendorController.saveVendorInvoice);

  router.post("/vendor-invoice-detail-save",
  checkAuth, 
  extractFile, 
  vendorController.saveVendorInvoiceDetail);

  router.post("/vendor-invoice-product-detail-save",
  checkAuth, 
  extractFile, 
  vendorController.saveVendorInvoiceProductDetail);


  router.delete("/vendor-invoice-delete/:id",
  checkAuth, 
  vendorController.deleteVendorInvoice);

  router.delete("/vendor-invoice-detail-delete/:id",
  checkAuth, 
  vendorController.deleteVendorInvoiceDetail);

  router.post("/vendor-invoice-product-detail-delete",
  checkAuth, 
  vendorController.deleteVendorInvoiceProductDetail);
  
  router.put("/vendor-invoice-update/:id",
  checkAuth, 
  extractFile,
  vendorController.updateVendorInvoice);
  
  router.get("/vendor-invoice-get/:id", vendorController.getSingleVendorInvoice);

  module.exports = router;