const Customer = require('../models/customer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.createCustomer = (req, res, next)=>{
    bcrypt.hash(req.body.password, 10)
    .then(hash => {
        
        const customer = new Customer({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            phone: req.body.phone,
            password: hash
        });

        customer.save()
        .then(result => {
            res.status(200).json({
                message: 'Customer created successfully!',
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

exports.customerLogin = (req, res, next)=>{
    let fetchedCustomer;
    Customer.findOne({
        email: req.body.email
    })
    .then(customer => {
        if(!customer){
            return res.status(401).json({
                message: "Invalid authentication credentials"
            });
        }
        fetchedCustomer = customer;
        return bcrypt.compare(req.body.password, customer.password)
    })
    .then(result => {
        if(!result){
            return res.status(401).json({
                message: "Invalid authentication credentials"
            });
        }
        if(fetchedCustomer){
            const token = jwt.sign({
                email: fetchedCustomer.email,
                customerId: fetchedCustomer._id
            }, process.env.JWT_KEY, {
                expiresIn: '1h'
            });
            res.status(200).json({
                token: token,
                customerId: fetchedCustomer._id,
                expiresIn: 3600
            });
        }
    })
    .catch(err => {
        return res.status(401).json({
            message: "Invalid authentication credentials"
        });
    });
}