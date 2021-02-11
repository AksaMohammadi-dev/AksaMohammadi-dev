const express = require('express');

const extractFile = require('../middleware/file');
const router = express.Router();
const categoryController = require('../controllers/category');
const checkAuth = require('../middleware/check-auth');


  router.use('/categorys', categoryController.getAllCategorys);
  
  router.post("/save",
  checkAuth, 
  extractFile, 
  categoryController.saveCategory);
  
  router.put("/update/:id",
  checkAuth, 
  extractFile,
  categoryController.updateCategory);
  
  router.delete("/delete/:id",
  checkAuth, 
  categoryController.deleteCategory);
  
  router.get("/get/:id", categoryController.getSingleCategory);

  module.exports = router;