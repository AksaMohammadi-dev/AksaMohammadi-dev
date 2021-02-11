const express = require('express');

const extractFile = require('../middleware/file');
const router = express.Router();
const productController = require('../controllers/product');
const checkAuth = require('../middleware/check-auth');


  router.use('/products', productController.getAllProducts);
  
  router.post("/save",
  checkAuth, 
  extractFile, 
  productController.saveProduct);
  
  router.put("/update/:id",
  checkAuth, 
  extractFile,
  productController.updateProduct);

  router.put("/updateProductSellPrice/:id",
  checkAuth, 
  productController.updateProductSellPrice);
    
  router.delete("/delete/:id",
  checkAuth, 
  productController.deleteProduct);
  
  router.get("/get/:id", productController.getSingleProduct);

  module.exports = router;