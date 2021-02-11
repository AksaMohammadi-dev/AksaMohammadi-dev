const VendorPaymentManagement = require('../models/vendor-payment-management');
  
exports.getAllVendorPaymentManagements = (req, res, next) => {
    const pageSize = +req.query.pageSize;
    const currentPage = +req.query.page;
    const vendorPaymentManagementQuery = VendorPaymentManagement.find();
    let fetchedVendorPaymentManagements;
    if(pageSize && currentPage){
        vendorPaymentManagementQuery
        .skip(pageSize * (currentPage - 1))
        .limit(pageSize);
    }
    vendorPaymentManagementQuery
        .then(documents => {
        VendorPaymentManagement.countDocuments({}, function(err, count) {
            res.status(200).json({
            message: 'Vendor Payment Management send successfully!',
            vendorPaymentManagements: documents,
            maxVendorPaymentManagements: count
            });
        })
        .catch(error => {
            res.status(500).json({
            message: "Fetching a Vendor Payment Management failed!!"
            })
        });
        
        });

}

exports.saveVendorPaymentManagement = (req,res,next) => {
    const url = req.protocol + '://' + req.get("host");
    const vendorPaymentManagement = new VendorPaymentManagement({
        ponumber: req.body.ponumber,
		invoicenumber: req.body.invoicenumber,
		vendor: req.body.vendor,
		amount: req.body.amount,
		modeofpayment: req.body.modeofpayment,
		paymentslipref: req.body.paymentslipref,
		paymentlocation: req.body.paymentlocation,
        creator: req.userData.userId,
        createdDate: Date.now()
    });
    //console.log(vendorPaymentManagement);
    vendorPaymentManagement.save().then(createdVendorPaymentManagement => {
        res.status(201).json({
        message: 'Vendor Payment Management added successfully!!',
        vendorPaymentManagement: {
            ...createdVendorPaymentManagement,
            id: createdVendorPaymentManagement._id,
            }
        });
    })
    .catch(error => {
        console.log(error);
        res.status(500).json({
        message: "Creating a Vendor Payment Management failed!!"
        })
    });
    
    }

exports.updateVendorPaymentManagement = (req, res, next) => {

    const vendorPaymentManagement = new VendorPaymentManagement({
        _id: req.body.id,
        ponumber: req.body.ponumber,
		invoicenumber: req.body.invoicenumber,
		vendor: req.body.vendor,
		amount: req.body.amount,
		modeofpayment: req.body.modeofpayment,
		paymentslipref: req.body.paymentslipref,
		paymentlocation: req.body.paymentlocation,
        modifiedDate: Date.now()
    })
    
    VendorPaymentManagement.updateOne({_id: req.params.id, creator: req.userData.userId }, vendorPaymentManagement).then(result => {
        if(result.n > 0){
        res.status(200).json({message: "updated!!"})
        }
        else{
        res.status(401).json({message: "Not authorized!!"})
        }
    })
    .catch(error => {
        res.status(500).json({
        message: "Could not update Vendor Payment Management"
        })
    })
    }

exports.deleteVendorPaymentManagement = (req, res, next) => {

VendorPaymentManagement.deleteOne({ _id: req.params.id, creator: req.userData.userId})
.then(result => {
    if(result.n > 0){
    res.status(200).json({ message: "Vendor Payment Management deleted!!" });
    }
    else{
    res.status(401).json({message: "Not authorized!!"})
    }
    
})
.catch(error => {
    res.status(500).json({
    message: "Deleting a Vendor Payment Management failed!!"
    })
})
}

exports.getSingleVendorPaymentManagement = (req, res, next) => {

    VendorPaymentManagement.findById(req.params.id).then(vendorPaymentManagement => {
        if(vendorPaymentManagement){
        res.status(200).json(vendorPaymentManagement);
        }
        else{
        res.status(404).json({message: "Error occurred!!"});
        }
    })
    .catch(error => {
        res.status(500).json({
        message: "Fetching Vendor Payment Management failed!!"
        })
    });
}