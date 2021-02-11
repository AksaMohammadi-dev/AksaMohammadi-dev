const VendorPurchaseOrder = require('../models/vendor-purchase-order');
const Stock = require('../models/stock');
  
exports.getAllVendorPurchaseOrders = (req, res, next) => {
    const pageSize = +req.query.pageSize;
    const currentPage = +req.query.page;
    const vendorPurchaseOrderQuery = VendorPurchaseOrder.find();
    let fetchedVendorPurchaseOrders;
    if(pageSize && currentPage){
        vendorPurchaseOrderQuery
        .skip(pageSize * (currentPage - 1))
        .limit(pageSize);
    }
    vendorPurchaseOrderQuery
        .then(documents => {
        VendorPurchaseOrder.countDocuments({}, function(err, count) {
            res.status(200).json({
            message: 'Vendor Purchase Order send successfully!',
            vendorPurchaseOrders: documents,
            maxVendorPurchaseOrders: count
            });
        })
        .catch(error => {
            res.status(500).json({
            message: "Fetching a Vendor Purchase Order failed!!"
            })
        });
        
        });

}

exports.saveVendorPurchaseOrder = (req,res,next) => {
    const url = req.protocol + '://' + req.get("host");
    const vendorPurchaseOrder = new VendorPurchaseOrder({
        ponumber: req.body.ponumber,
        product: req.body.product,
        quantity: req.body.quantity,
        vendor: req.body.vendor,
        creator: req.body.creator,
        creator: req.userData.userId,
        createdDate: Date.now()
    });
    
        vendorPurchaseOrder.save().then(createdVendorPurchaseOrder => {
            
            Stock.findOne({ product: vendorPurchaseOrder.product }).then(stockData => {
                if(stockData != null){

                    stockData.quantityPO = +stockData.quantityPO + +req.body.quantity

                    stockData.save(function (err) {
                        if(!err) {
                            res.status(201).json({
                                message: 'Vendor Purchase Order and Stock added successfully!!',
                                vendorPurchaseOrder: {
                                    ...createdVendorPurchaseOrder,
                                    id: createdVendorPurchaseOrder._id,
                                    }
                                });
                        }
                    });
                }
                else{
                    res.status(201).json({
                        message: 'Vendor Purchase Order added successfully!!',
                        vendorPurchaseOrder: {
                            ...createdVendorPurchaseOrder,
                            id: createdVendorPurchaseOrder._id,
                            }
                        });
                }
            })
            .catch(error => {
                console.log(error)
                res.status(500).json({
                message: "Could not update vendor purchase order"
                })
            })


            
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({
            message: "Creating a Vendor Purchase Order failed!!"
            })
        });
    
    }

exports.updateVendorPurchaseOrder = (req, res, next) => {
    
    const vendorPurchaseOrder = new VendorPurchaseOrder({
        _id: req.body.id,
        ponumber: req.body.ponumber,
        product: req.body.product,
        quantity: req.body.quantity,
        vendor: req.body.vendor,
        creator: req.userData.userId,
        modifiedDate: Date.now()
    })

    VendorPurchaseOrder.updateOne({_id: req.params.id, creator: req.userData.userId }, vendorPurchaseOrder).then(result => {
        if(result.n > 0){
        res.status(200).json({message: "updated!!"})
        }
        else{
        res.status(401).json({message: "Not authorized!!"})
        }
    })
    .catch(error => {
        res.status(500).json({
        message: "Could not update vendor purchase order"
        })
    })
    }

exports.deleteVendorPurchaseOrder = (req, res, next) => {

VendorPurchaseOrder.deleteOne({ _id: req.params.id, creator: req.userData.userId})
.then(result => {
    if(result.n > 0){
    res.status(200).json({ message: "VendorPurchaseOrder deleted!!" });
    }
    else{
    res.status(401).json({message: "Not authorized!!"})
    }
    
})
.catch(error => {
    res.status(500).json({
    message: "Deleting a Vendor Purchase Order failed!!"
    })
})
}

exports.getSingleVendorPurchaseOrder = (req, res, next) => {

    VendorPurchaseOrder.findById(req.params.id).then(vendorPurchaseOrder => {
        if(vendorPurchaseOrder){
        res.status(200).json(vendorPurchaseOrder);
        }
        else{
        res.status(404).json({message: "Error occurred!!"});
        }
    })
    .catch(error => {
        res.status(500).json({
        message: "Fetching Vendor Purchase Order failed!!"
        })
    });
}