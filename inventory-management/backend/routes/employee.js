const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employee');
const checkAuth = require('../middleware/check-auth');

router.post("/signup", employeeController.createEmployee);

router.post("/login", employeeController.employeeLogin);

router.post("/updateActiveEmployee",
checkAuth, 
employeeController.activeEmployee);

router.use('/getAllNonActiveEmployee', employeeController.getAllNonActivatedEmp);


module.exports = router;