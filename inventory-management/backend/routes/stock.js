const express = require('express');

const extractFile = require('../middleware/file');
const router = express.Router();
const stockController = require('../controllers/stock');
const checkAuth = require('../middleware/check-auth');
  
  router.get("/getAllStocks", stockController.getAllStocks);

  router.get("/getAllStocksStockDetialsProductDetials", stockController.getAllStocksStockDetialsProductDetials);

  router.get("/getAllStocksAndStockDetials", stockController.getAllStocksAndStockDetials);

  router.get("/getStockDetailsByStockId/:stockId", stockController.getStockDetailsByStockId);

  router.put("/updateLocationsForProduct", stockController.updateLocationsForProduct);


  module.exports = router;