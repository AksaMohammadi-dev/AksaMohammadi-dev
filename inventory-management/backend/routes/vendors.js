const express = require('express');

const extractFile = require('../middleware/file');
const router = express.Router();
const vendorController = require('../controllers/vendor');
const checkAuth = require('../middleware/check-auth');


  router.use('/vendors', vendorController.getAllVendors);
  
  router.post("/save",
  checkAuth, 
  extractFile, 
  vendorController.saveVendor);
  
  router.put("/update/:id",
  checkAuth, 
  extractFile,
  vendorController.updateVendor);
  
  router.delete("/delete/:id",
  checkAuth, 
  vendorController.deleteVendor);
  
  router.get("/get/:id", vendorController.getSingleVendor);

  module.exports = router;