const Employee = require('../models/employee');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.createEmployee = (req, res, next)=>{
    bcrypt.hash(req.body.password, 10)
    .then(hash => {
        
        const employee = new Employee({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            phone: req.body.phone,
            password: hash,
            isAdmin: false,
            isEmployee: true,
            isActive: false
        });

        employee.save()
        .then(result => {
            res.status(200).json({
                message: 'Employee created successfully!',
                result: result,
              });
        })
        .catch(err => {
            res.status(500).json({
                    message: "Invalid authentication credentials"
                });
        });
    });
    
}

exports.employeeLogin = (req, res, next)=>{
    let fetchedEmployee;
    Employee.findOne({
        email: req.body.email,
        isActive: true
    })
    .then(employee => {
        if(!employee){
            return res.status(401).json({
                message: "Invalid authentication credentials or Credentials not yet activated by Admin"
            });
        }
        fetchedEmployee = employee;
        return bcrypt.compare(req.body.password, employee.password)
    })
    .then(result => {
        if(!result){
            return res.status(401).json({
                message: "Invalid authentication credentials or Credentials not yet activated by Admin"
            });
        }
        
        if(fetchedEmployee){
            const token = jwt.sign({
                email: fetchedEmployee.email,
                employeeId: fetchedEmployee._id
            }, process.env.JWT_KEY, {
                expiresIn: '1h'
            });
            res.status(200).json({
                token: token,
                employeeId: fetchedEmployee._id,
                isAdmin: fetchedEmployee.isAdmin,
                expiresIn: 3600
            });
        }
        
    })
    .catch(err => {
        return res.status(401).json({
            message: "Invalid authentication credentials or Credentials not yet activated by Admin"
        });
    });
}

exports.activeEmployee = (req, res, next)=>{

    Employee.updateMany({ _id: { "$in": req.body.empIds } }, {
        $set: { isActive: true }
      }).then(result => {
        if(result.n > 0){
        res.status(200).json({message: "updated!!"})
        }
        else{
        res.status(401).json({message: "Not authorized!!"})
        }
    })
    .catch(error => {
        res.status(500).json({
        message: "Could not update employee"
        })
    })
    .catch(error => {
        res.status(500).json({
        message: "Could not update employee"
        })
    })
    
}

exports.getAllNonActivatedEmp = (req, res, next) => {
    
    const query = Employee.find({ isActive: false});
    
    query
        .then(documents => {
        Employee.countDocuments({}, function(err, count) {

            res.status(200).json({
            message: 'Employees send successfully!',
            employees: documents,
            maxEmployees: count
            });
        })
        .catch(error => {
            res.status(500).json({
            message: "Fetching Employees failed!!"
            })
        });
        
        });

}