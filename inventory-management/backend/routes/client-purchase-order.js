const express = require('express');

const extractFile = require('../middleware/file');
const router = express.Router();
const clientPurchaseOrderController = require('../controllers/client-purchase-order');
const checkAuth = require('../middleware/check-auth');


  // router.use('/client-purchase-orders', clientPurchaseOrderController.getAllclientPurchaseOrders);
  
  router.get("/client-purchase-order",
  checkAuth, 
  // extractFile, 
  clientPurchaseOrderController.getAllClientPurchaseOrder);

  router.post("/save-client-purchase-order",
  checkAuth, 
  // extractFile, 
  clientPurchaseOrderController.saveClientPurchaseOrder);
  
//   router.put("/update-client-purchase-order/:id",
//   checkAuth, 
//   extractFile,
//   clientPurchaseOrderController.updateClientPurchaseOrder);
  
  router.delete("/delete-client-purchase-order/:id",
  checkAuth, 
  clientPurchaseOrderController.deleteClientPurchaseOrder);
  
  router.get("/client-purchase-order-get/:id",checkAuth, clientPurchaseOrderController.getSingleClientPurchaseOrder);
  
  router.get("/getClientPOByClientId/:clientId",checkAuth, clientPurchaseOrderController.getClientPOByClientId);

  router.post("/getPOforPO_num",checkAuth, clientPurchaseOrderController.getPOforPO_num);

  module.exports = router;