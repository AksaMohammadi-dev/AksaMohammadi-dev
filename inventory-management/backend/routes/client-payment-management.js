const express = require('express');

const extractFile = require('../middleware/file');
const router = express.Router();
const clientPaymentManagementController = require('../controllers/client-payment-management');
const checkAuth = require('../middleware/check-auth');


  // router.use('/client-purchase-orders', clientPaymentManagementController.getAllclientPurchaseOrders);
  
  router.get("/client-payment-management",
  checkAuth, 
  // extractFile, 
  clientPaymentManagementController.getAllClientPaymentDetails);

  router.get("/client-invoices/:client_id",
  checkAuth, 
  // extractFile, 
  clientPaymentManagementController.clientInvoices);

  router.post("/save-client-payment-management-detail",
  checkAuth, 
  // extractFile, 
  clientPaymentManagementController.saveClientInvoiceDetail);
  
  router.post("/save-client-payment",
  checkAuth, 
  // extractFile, 
  clientPaymentManagementController.createClientPayment);
  
  router.put("/update-client-payment-management-detail/:id",
  checkAuth, 
  // extractFile,
  clientPaymentManagementController.updateClientPaymentDetail);
  
  router.delete("/delete-client-payment-management-detail/:id",
  checkAuth, 
  clientPaymentManagementController.deleteClientPaymentDetail);
  
  router.get("/client-payment-management-detail-get/:id",checkAuth, clientPaymentManagementController.getSingleClientPaymentDetail);
  
  module.exports = router;