const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.createUser = (req, res, next)=>{
    bcrypt.hash(req.body.password, 10)
    .then(hash => {
        
        const user = new User({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            phone: req.body.phone,
            password: hash
        });

        user.save()
        .then(result => {
            res.status(200).json({
                message: 'User created successfully!',
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

exports.userLogin = (req, res, next)=>{
    let fetchedUser;
    User.findOne({
        email: req.body.email
    })
    .then(user => {
        if(!user){
            return res.status(401).json({
                message: "Invalid authentication credentials"
            });
        }
        fetchedUser = user;
        return bcrypt.compare(req.body.password, user.password)
    })
    .then(result => {
        if(!result){
            return res.status(401).json({
                message: "Invalid authentication credentials"
            });
        }
        if(fetchedUser){
            const token = jwt.sign({
                email: fetchedUser.email,
                userId: fetchedUser._id
            }, process.env.JWT_KEY, {
                expiresIn: '1h'
            });
            res.status(200).json({
                token: token,
                userId: fetchedUser._id,
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