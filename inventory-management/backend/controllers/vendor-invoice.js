const VendorInvoice = require('../models/vendor-invoice');
const VendorInvoiceDetail = require('../models/vendor-invoice-detail');
const VendorInvoiceProductDetail = require('../models/vendor-invoice-product-detail');

const Stock = require('../models/stock');
const StockDetail = require('../models/stock-detail');
  
exports.getAllVendorInvoices = (req, res, next) => {
    const pageSize = +req.query.pageSize;
    const currentPage = +req.query.page;
    const vendorInvoiceQuery = VendorInvoice.find();
    let fetchedClients;
    if(pageSize && currentPage){
        vendorInvoiceQuery
        .skip(pageSize * (currentPage - 1))
        .limit(pageSize);
    }
    vendorInvoiceQuery
        .then(documents => {
        VendorInvoice.countDocuments({}, function(err, count) {
            res.status(200).json({
            message: 'Vendor Invoice send successfully!',
            vendorInvoices: documents,
            maxVendorInvoices: count
            });
        })
        .catch(error => {
            res.status(500).json({
            message: "Fetching a Vendor Invoice failed!!"
            })
        });
        
        });

}



//#region vendor invoice

exports.saveVendorInvoice = (req,res,next) => {
    const url = req.protocol + '://' + req.get("host");
    const vendorInvoice = new VendorInvoice({
        invoiceno: req.body.invoiceno,
        totalamount: req.body.totalamount,
        vendor: req.body.vendor,
        creator: req.body.creator,
        createdDate: Date.now(),
    });
    
    vendorInvoice.save().then(createdVendorInvoice => {

        res.status(201).json({
        message: 'Vendor Invoice added successfully!!',
        vendorInvoice: {
            ...createdVendorInvoice,
            id: createdVendorInvoice._id,
            }
        });
    })
    .catch(error => {
        res.status(500).json({
        message: "Creating a Vendor Invoice failed!!"
        })
    });
    
    }

exports.updateVendorInvoice = (req, res, next) => {
    let imagePath = req.imagePath;
    
    const vendorInvoice = new VendorInvoice({
        _id: req.body.id,
        name: req.body.name,
        modifiedDate: Date.now()
    })
    
    VendorInvoice.updateOne({_id: req.params.id, creator: req.userData.userId }, vendorInvoice).then(result => {
        if(result.n > 0){
        res.status(200).json({message: "updated!!"})
        }
        else{
        res.status(401).json({message: "Not authorized!!"})
        }
    })
    .catch(error => {
        res.status(500).json({
        message: "Could not update Vendor Invoice"
        })
    })
}

exports.deleteVendorInvoice = (req, res, next) => {

    
    VendorInvoice.deleteOne({ _id: req.params.id, creator: req.userData.userId})
    .then(result => {
        if(result.n > 0){
        res.status(200).json({ message: "Vendor Invoice deleted!!" });
        }
        else{
        res.status(401).json({message: "Not authorized!!"})
        }
        
    })
    .catch(error => {
        res.status(500).json({
        message: "Deleting a Vendor Invoice failed!!"
        })
    })
}

exports.getSingleVendorInvoice = (req, res, next) => {

    VendorInvoice.findById(req.params.id).then(vendorInvoice => {
        if(vendorInvoice){
        res.status(200).json(vendorInvoice);
        }
        else{
        res.status(404).json({message: "Error occurred!!"});
        }
    })
    .catch(error => {
        res.status(500).json({
        message: "Fetching Vendor Invoice failed!!"
        })
    });
}

//#endregion vendor invoice





//#region vendor invoice detail
async function getVendorInvoiceDetail(req, res, next) {
    
    let vendorDetail = await getAsyncVendorInvoiceDetail(req, res, next);
    if(vendorDetail && vendorDetail.length > 0){
        for (let invoiceDetailCnt = 0; invoiceDetailCnt < vendorDetail.length; invoiceDetailCnt++) {
            let stockDetail = await getProductStock(vendorDetail[invoiceDetailCnt])
            vendorDetail[invoiceDetailCnt].stockId = stockDetail._id
        }
        
    }
    
    res.status(200).json(vendorDetail);

    // VendorInvoiceDetail.find({vendorinvoice: req.params.id}).then(vendorInvoice => {
    //     console.log('xxxxx',vendorInvoice)
    //     if(vendorInvoice){
    //         for (let invoiceDetailCnt = 0; invoiceDetailCnt < vendorInvoice; invoiceDetailCnt++) {
    //             let stockDetail = await getProductStock(vendorInvoice[invoiceDetailCnt])
    //             console.log('xxxxx',stockDetail)
    //         }
            
    //         res.status(200).json(vendorInvoice);
    //     }
    //     else{
    //     res.status(404).json({message: "Error occurred!!"});
    //     }
    // })
    // .catch(error => {
    //     res.status(500).json({
    //     message: "Fetching Vendor Invoice Detail failed!!"
    //     })
    // });
}

async function getProductStock(vendorDetail) {

    const stockDetail = Stock.findOne({ product: vendorDetail.product });
    return stockDetail;
}

async function getAsyncVendorInvoiceDetail(req,res,next){
    return VendorInvoiceDetail.find({vendorinvoice: req.params.id});
}

exports.saveVendorInvoiceDetail = (req,res,next) => {
    
    const vendorInvoiceDetail = new VendorInvoiceDetail({
        quantity: req.body.quantity,
        product: req.body.product,
        vendorinvoice: req.body.vendorinvoice,
        creator: req.body.creator
    });

    const stock = new Stock({
        quantity: req.body.quantity,
        product: req.body.product,
        creator: req.body.creator,
        quantityPO: 0,
        createdDate: Date.now(),
    });
    
    
    Stock.findOne({product: stock.product, creator: req.body.creator }).then(stck => {

        vendorInvoiceDetail.save().then(createdVendorInvoiceDetail => {

            if(stck){ //update stock quantity
                Stock.updateOne({_id: stck._id, creator: req.body.creator }, {
                    quantity: +stock.quantity + +stck.quantity
                }).then(result => {

                    res.status(201).json({
                        message: 'Vendor Invoice Detail added successfully!!',
                        vendorInvoice: {
                            ...createdVendorInvoiceDetail,
                            id: createdVendorInvoiceDetail._id,
                            stockId: result._id
                            }
                        });
                })
                .catch(error => {
                    console.log(error);
                    res.status(500).json({
                    message: "Creating a Stock failed!!"
                    })
                });
            }
            else{ //insert stock details

                stock.save().then(savedStockData => {

                    res.status(201).json({
                        message: 'Vendor Invoice Detail added successfully!!',
                        vendorInvoice: {
                            ...createdVendorInvoiceDetail,
                            id: createdVendorInvoiceDetail._id,
                            stockId: savedStockData._id
                            }
                        });

                })
                .catch(error => {
                    console.log(error);
                    res.status(500).json({
                    message: "Creating a Stock Detail failed!!"
                    })
                });
            }
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({
            message: "Creating a Vendor Invoice Detail failed!!"
            })
        });
    })
    .catch(error => {
        console.log(error);
        res.status(500).json({
        message: "Unable to fetch product stock!!"
        })
    });
    
    
}

exports.updateVendorInvoiceDetail = (req, res, next) => {
    
    const vendorInvoiceDetail = new VendorInvoiceDetail({
        quantity: req.userData.quantity,
        product: req.userData.product,
        modifiedDate: Date.now()
    })
    
    VendorInvoiceDetail.updateOne({_id: req.params.id, creator: req.userData.userId }, vendorInvoice).then(result => {
        if(result.n > 0){
        res.status(200).json({message: "updated!!"})
        }
        else{
        res.status(401).json({message: "Not authorized!!"})
        }
    })
    .catch(error => {
        res.status(500).json({
        message: "Could not update Vendor Invoice"
        })
    })
}

exports.deleteVendorInvoiceDetail = (req, res, next) => {

    VendorInvoiceDetail.deleteOne({ _id: req.params.id, creator: req.userData.userId})
    .then(result => {
        if(result.n > 0){
        res.status(200).json({ message: "Vendor Invoice Detail deleted!!" });
        }
        else{
        res.status(401).json({message: "Not authorized!!"})
        }
        
    })
    .catch(error => {
        res.status(500).json({
        message: "Deleting a Vendor Invoice Detail failed!!"
        })
    })
}

exports.getSingleVendorInvoiceDetail = (req, res, next) => {

    VendorInvoiceDetail.findById(req.params.id).then(vendorInvoice => {
        if(vendorInvoice){
        res.status(200).json(vendorInvoice);
        }
        else{
        res.status(404).json({message: "Error occurred!!"});
        }
    })
    .catch(error => {
        res.status(500).json({
        message: "Fetching Vendor Invoice Detail failed!!"
        })
    });
}

//#endregion vendor invoice detail








//#region vendor invoice product detail

exports.getAllVendorInvoiceProductDetail = (req, res, next) => {

    VendorInvoiceProductDetail.find({
        vendorinvoicedetail: req.params.vendorInvoiceDetailId
    }).then(vendorInvoice => {
        if(vendorInvoice){
        res.status(200).json(vendorInvoice);
        }
        else{
        res.status(404).json({message: "Error occurred!!"});
        }
    })
    .catch(error => {
        res.status(500).json({
        message: "Fetching Vendor Invoice Product Detail failed!!"
        })
    });
}

exports.saveVendorInvoiceProductDetail = (req,res,next) => {
    
    const vendorInvoiceProductDetail = new VendorInvoiceProductDetail({
        serialno: req.body.serialno,
        subloc: req.body.subloc,
        loc: req.body.loc,
        creator: req.userData.userId,
        vendorinvoicedetail: req.body.vendorinvoicedetail
    });

    const stockDetail = new StockDetail({
        serialno: req.body.serialno,
        subloc: req.body.subloc,
        loc: req.body.loc,
        creator: req.userData.userId,
        stock: req.body.stockId,
        createdDate: new Date()
    });

    vendorInvoiceProductDetail.save().then(createdVendorInvoiceProductDetail => {

        stockDetail.save().then(stockDetailsData => {
            res.status(201).json({
                message: 'Vendor Invoice Product Detail added successfully!!',
                vendorInvoiceDetail: {
                    ...createdVendorInvoiceProductDetail,
                    id: createdVendorInvoiceProductDetail._id,
                    }
                });
        });

        
    })
    .catch(error => {
        console.log(error);
        res.status(500).json({
        message: "Creating a Vendor Invoice Product Detail failed!!"
        })
    });
    
    }

exports.updateVendorInvoiceProductDetail = (req, res, next) => {
    
    const vendorInvoiceProductDetail = new VendorInvoiceProductDetail({
        serialno: req.userData.serialno,
        subloc: req.userData.subloc,
        loc: req.userData.loc,
        modifiedDate: Date.now()
    })
    
    VendorInvoiceProductDetail.updateOne({_id: req.params.id, creator: req.userData.userId }, vendorInvoice).then(result => {
        if(result.n > 0){
        res.status(200).json({message: "updated!!"})
        }
        else{
        res.status(401).json({message: "Not authorized!!"})
        }
    })
    .catch(error => {
        res.status(500).json({
        message: "Could not update Vendor Invoice Product Detail"
        })
    })
}

exports.deleteVendorInvoiceProductDetail = (req, res, next) => {

    VendorInvoiceProductDetail.deleteOne({ _id: req.params.id, creator: req.userData.userId})
    .then(result => {
        if(result.n > 0){
        res.status(200).json({ message: "Vendor Invoice Product Detail deleted!!" });
        }
        else{
        res.status(401).json({message: "Not authorized!!"})
        }
        
    })
    .catch(error => {
        res.status(500).json({
        message: "Deleting a Vendor Invoice Product Detail failed!!"
        })
    })
}

exports.getSingleVendorInvoiceProductDetail = (req, res, next) => {

    VendorInvoiceProductDetail.findById(req.params.id).then(vendorInvoice => {
        if(vendorInvoice){
        res.status(200).json(vendorInvoice);
        }
        else{
        res.status(404).json({message: "Error occurred!!"});
        }
    })
    .catch(error => {
        res.status(500).json({
        message: "Fetching Vendor Invoice Product Detail failed!!"
        })
    });
}

//#endregion vendor invoice product detail



module.exports.getVendorInvoiceDetail = getVendorInvoiceDetail
