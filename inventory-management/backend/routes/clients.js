const express = require('express');

const extractFile = require('../middleware/file');
const router = express.Router();
const clientController = require('../controllers/client');
const checkAuth = require('../middleware/check-auth');


  router.use('/clients', clientController.getAllClients);
  
  router.post("/save",
  checkAuth, 
  extractFile, 
  clientController.saveClient);
  
  router.put("/update/:id",
  checkAuth, 
  extractFile,
  clientController.updateClient);
  
  router.delete("/delete/:id",
  checkAuth, 
  clientController.deleteClient);
  
  router.get("/get/:id", clientController.getSingleClient);

  module.exports = router;