const express = require('express');

const extractFile = require('../middleware/file');
const router = express.Router();
const clientPurchaseOrderDetailController = require('../controllers/client-purchase-order-detail');
const checkAuth = require('../middleware/check-auth');


  // router.use('/client-purchase-orders', clientPurchaseOrderDetailController.getAllclientPurchaseOrders);
  
  router.get("/client-purchase-order-detail",
  checkAuth, 
  // extractFile, 
  clientPurchaseOrderDetailController.getAllClientPurchaseOrderDetail);

  router.post("/save-client-purchase-order-detail",
  checkAuth, 
  // extractFile, 
  clientPurchaseOrderDetailController.saveClientPurchaseOrderDetail);
  
  router.put("/update-client-purchase-order-detail/:id",
  checkAuth, 
  // extractFile,
  clientPurchaseOrderDetailController.updateClientPurchaseOrderDetail);
  
  router.put("/update-client-purchase-order-by-invoice-detials/:id",
  checkAuth, 
  // extractFile,
  clientPurchaseOrderDetailController.updateClientPurchaseOrderByInvoiceDetials);

  router.delete("/delete-client-purchase-order-detail/:id",
  checkAuth, 
  clientPurchaseOrderDetailController.deleteClientPurchaseOrderDetail);
  
  router.get("/client-purchase-order-detail-get/:id",checkAuth, clientPurchaseOrderDetailController.getSingleClientPurchaseOrderDetail);

  router.get("/serial-no-by-productId-get/:productId",checkAuth, clientPurchaseOrderDetailController.getSerialNoByProductId);
  
  router.get("/get-client-purchase-order-by-invoice-detials",
  checkAuth, 
  // extractFile,
  clientPurchaseOrderDetailController.getClientPurchaseOrderByInvoiceDetials);

  router.get("/getClientInvoiceNumber",
  checkAuth, 
  // extractFile,
  clientPurchaseOrderDetailController.getClientInvoiceNumber);

  router.put("/removeStockDetialsAndStockQty",
  checkAuth, 
  // extractFile,
  clientPurchaseOrderDetailController.removeStockDetialsAndStockQty);

  module.exports = router;