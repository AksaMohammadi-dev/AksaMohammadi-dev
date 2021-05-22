const Vendor = require('../models/vendor');
  
exports.getAllVendors = (req, res, next) => {
    const pageSize = +req.query.pageSize;
    const currentPage = +req.query.page;
    const vendorQuery = Vendor.find();
    let fetchedVendors;
    if(pageSize && currentPage){
        vendorQuery
        .skip(pageSize * (currentPage - 1))
        .limit(pageSize);
    }
    vendorQuery
        .then(documents => {
        Vendor.countDocuments({}, function(err, count) {
            res.status(200).json({
            message: 'Vendor send successfully!',
            vendors: documents,
            maxVendors: count
            });
        })
        .catch(error => {
            res.status(500).json({
            message: "Fetching a Vendor failed!!"
            })
        });
        
        });

}

exports.saveVendor = (req,res,next) => {
    const url = req.protocol + '://' + req.get("host");
    const vendor = new Vendor({
        name: req.body.name,
        creator: req.userData.userId,
        createdDate: Date.now()
    });
    vendor.save().then(createdVendor => {
        res.status(201).json({
        message: 'Vendor added successfully!!',
        vendor: {
            ...createdVendor,
            id: createdVendor._id,
            }
        });
    })
    .catch(error => {
        console.log(error);
        res.status(500).json({
        message: "Creating a Vendor failed!!"
        })
    });
    
    }

exports.updateVendor = (req, res, next) => {
    let imagePath = req.imagePath;
    if(req.file){
        const url = req.protocol + '://' + req.get("host");
        imagePath = url + "/images/" + req.file.filename
    }
    const vendor = new Vendor({
        _id: req.body.id,
        name: req.body.name,
        modifiedDate: Date.now()
    })
    
    Vendor.updateOne({_id: req.params.id, creator: req.userData.userId }, vendor).then(result => {
        if(result.n > 0){
        res.status(200).json({message: "updated!!"})
        }
        else{
        res.status(401).json({message: "Not authorized!!"})
        }
    })
    .catch(error => {
        res.status(500).json({
        message: "Could not update vendor"
        })
    })
    }

exports.deleteVendor = (req, res, next) => {

Vendor.deleteOne({ _id: req.params.id, creator: req.userData.userId})
.then(result => {
    if(result.n > 0){
    res.status(200).json({ message: "Vendor deleted!!" });
    }
    else{
    res.status(401).json({message: "Not authorized!!"})
    }
    
})
.catch(error => {
    res.status(500).json({
    message: "Deleting a Vendor failed!!"
    })
})
}

exports.getSingleVendor = (req, res, next) => {

    Vendor.findById(req.params.id).then(vendor => {
        if(vendor){
        res.status(200).json(vendor);
        }
        else{
        res.status(404).json({message: "Error occurred!!"});
        }
    })
    .catch(error => {
        res.status(500).json({
        message: "Fetching Vendor failed!!"
        })
    });
}