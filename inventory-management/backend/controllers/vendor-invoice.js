const VendorInvoice = require('../models/vendor-invoice');
const VendorInvoiceDetail = require('../models/vendor-invoice-detail');
const VendorInvoiceProductDetail = require('../models/vendor-invoice-product-detail');

const Stock = require('../models/stock');
const StockDetail = require('../models/stock-detail');
const locations = require('../eventHandler/locations');
  
exports.getAllVendorInvoices = (req, res, next) => {
    const pageSize = +req.query.pageSize;
    const currentPage = +req.query.page;
    const vendorInvoiceQuery = VendorInvoice.find();
    let fetchedClients;
    if(pageSize && currentPage){
        // vendorInvoiceQuery
        // .skip(pageSize * (currentPage - 1))
        // .limit(pageSize);
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
        status: true,
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
    VendorInvoice.findById({_id:req.params.id}, function (err, docs) { 
        if (err){ 
            res.send({status:false,message:'something went wrong, mongo query error'}) 
        } 
        else{ 
            if(docs && (docs != null || docs.length != 0)){
                VendorInvoiceDetail.find({vendorinvoice:req.params.id}, function (err, docs) { 
                    if (err){ 
                        console.log(err);
                    } 
                    else{
                        if(docs && (docs == null || docs.length == 0)){ 
                             // there is no vendor invoice details for it
                          //check for the invoiceprodouctdtails.?
                          VendorInvoice.deleteOne({ _id: req.params.id, creator: req.userData.userId})
                          .then(result => {
                              if(result.n > 0){
                              res.status(200).json({status:true, message: "Vendor Invoice deleted!!" });
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
                        }else{//it is having invoice details
                            res.send({status:false,message:'something went wrong, vendor invoice details are present for this invoice, please delete those .'})
                        }
                    } 
                })
            }else{
                res.send({status:false,message:'something went wrong, provided id is not found'})     
            }
        } 
    });
    
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
                        status: true,
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
                        status: true,
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
    VendorInvoiceDetail.findById({_id:req.params.id}, function (err, docs) { 
        if (err){ 
            console.log(err); 
        } 
        else{ 
            if(docs != null || (docs && docs.length != 0)){
                VendorInvoiceProductDetail.find({vendorinvoicedetail:req.params.id}, function (err, docs) { 
                    if (err){ 
                        console.log(err); 
                    }
                    else{
                        if(docs == null || docs.length == 0){
                            VendorInvoiceDetail.deleteOne({ _id: req.params.id, creator: req.userData.userId}).then(result => {
                                if(result.n > 0){
                                res.status(200).json({status:true, message: "Vendor Invoice Detail deleted!!" });
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
                        }else{
                            res.send({status:false,message:'something went wrong, vendor invoice product details are present for this invoice details, please delete those .'}) 
                        }
                    }
                })
            }else{
                res.send({status:false,message:'something went wrong, provided id is not found'})
            }
        }
    }); 
   
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
    let sublocObj;
    let locObj;
    if(req.body.subloc){
        sublocObj = locations.sublocation.find(obj => obj.id == req.body.subloc);
    }
    if(req.body.loc){
         locObj = locations.location.find(obj => obj.id == req.body.loc);
    }
    const vendorInvoiceProductDetail = new VendorInvoiceProductDetail({
        serialno: req.body.serialno,
        subloc: sublocObj.name,
        loc: locObj.name,
        creator: req.userData.userId,
        vendorinvoicedetail: req.body.vendorinvoicedetail
    });

    const stockDetail = new StockDetail({
        serialno: req.body.serialno,
        subloc: sublocObj.name,
        loc: locObj.name,
        creator: req.userData.userId,
        stock: req.body.stockId,
        createdDate: new Date()
    });

    vendorInvoiceProductDetail.save().then(createdVendorInvoiceProductDetail => {

        stockDetail.save().then(stockDetailsData => {
            res.status(201).json({
                status: true,
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
    var idArray = req.body.selectedArray.map(function (el) { return el.id; });
    var serialnoArray = req.body.selectedArray.map(function (el) { return el.serialno; });
    VendorInvoiceProductDetail.deleteMany( { _id : { $in : idArray } } ).then(productDelete => {
        if(productDelete.deletedCount >0){
            VendorInvoiceDetail.findOneAndUpdate({_id:req.body.selectedArray[0].vendorinvoicedetail},{ $inc: { quantity: -productDelete.deletedCount }},{ returnOriginal: false }).then(updatedVendInvoice => {
                if(updatedVendInvoice && updatedVendInvoice.product){
                    if(updatedVendInvoice.quantity <= 1){//because quantity is giving 1 not 0
                        VendorInvoiceDetail.deleteOne({_id:req.body.selectedArray[0].vendorinvoicedetail})
                        .then(resultDel => {
                            console.log('veninvoice_deletedstock ',resultDel)
                        })
                    }
                    Stock.findOneAndUpdate( {product:req.body.prodDetials.product},{ $inc: { quantity: -productDelete.deletedCount }},{returnOriginal: false }).then(updatedStock => {
                        if(updatedStock && updatedStock._id){
                            if(updatedStock.quantity <= 0){//because quantity is giving 1 not 0
                                Stock.deleteOne({product:req.body.prodDetials.product})
                                .then(resultDel => {
                                    console.log('deletedstock ',resultDel)
                                })
                            }
                            StockDetail.deleteMany({ serialno : { $in : serialnoArray } , stock: updatedStock._id }).then(result => {
                                if(result.deletedCount > 0){
                                    res.status(200).json({status:true, message: "vendor invoice product details is deleted successfuly" });
                                }else{
                                    res.status(400).json({status:false, message: "no records found in stock detials to delete" });
                                }
                            }).catch(error => {
                                res.status(500).json({
                                message: "Deleting a Stock Detail failed!!"
                                })
                            })
                        }else{
                            res.status(400).json({status:false, message: "Error occurred while updating stock quantity" });
                        }
                    }).catch(error => {
                        res.status(500).json({
                        message: "updating stock quantity failed!!"
                        })
                    })

                }else{
                    res.status(400).json({status:false, message: "Error occurred while updating vendor invoice quantity" });
                }
            }).catch(error => {
                res.status(500).json({
                message: "Deleting a Product Detail failed!!"
                })
            })
        }else{
            res.status(400).json({status:false, message: "no records found in vendor invoice product detials to delete" });
        }
    }).catch(error => {
        res.status(500).json({
        message: "Deleting a Vendor Invoice Product Detail failed!!"
        })
    })
    // VendorInvoiceProductDetail.findById(req.params.id).then(productDetails => {
    //     if(productDetails){
    //         let serialno = productDetails.serialno
    //         let subloc = productDetails.subloc
    //         let loc = productDetails.loc
    //         if(productDetails.vendorinvoicedetail && productDetails.serialno){
    //             VendorInvoiceProductDetail.deleteOne({ _id: req.params.id, creator: req.userData.userId})
    //             .then(result => {
    //                 if(result.n > 0){
    //                     res.status(200).json({status:true, message: "Vendor Invoice Product Detail deleted!!" });
    //                 }
    //                 else{
    //                     res.status(401).json({message: "no record found for the provided vendor invoice product details id"})
    //                 }
                    
    //             })
    //             .catch(error => {
    //                 res.status(500).json({
    //                 message: "Deleting a Vendor Invoice Product Detail failed!!"
    //                 })
    //             })
    //             VendorInvoiceDetail.findOneAndUpdate({_id:productDetails.vendorinvoicedetail},{ $inc: { quantity: -1 }},{ returnOriginal: false }).then(vendInvoicQuantity => {
    //                 if(vendInvoicQuantity && vendInvoicQuantity.product){
    //                         if(vendInvoicQuantity.quantity <= 1){//because quantity is giving 1 not 0
    //                             VendorInvoiceDetail.deleteOne({_id:productDetails.vendorinvoicedetail})
    //                             .then(resultDel => {
    //                                 console.log('veninvoice_deletedstock ',resultDel)
    //                             })
    //                         }
    //                     Stock.findOneAndUpdate( {product:vendInvoicQuantity.product},{ $inc: { quantity: -1 }},{returnOriginal: false }).then(stock => {
    //                         if(stock && stock._id){
    //                             if(stock.quantity <= 0){//because quantity is giving 1 not 0
    //                                 Stock.deleteOne({product:vendInvoicQuantity.product})
    //                                 .then(resultDel => {
    //                                     console.log('%%%%%%%%%%deletedstock ',resultDel)
    //                                 })
    //                             }
    //                             console.log('%%%%%%%%%%55 ',stock.quantity,stock._id,serialno,req.userData.userId,{ stock: stock._id ,serialno:serialno,creator: req.body.creator,subloc,loc})
    //                             StockDetail.deleteOne({ stock: stock._id ,serialno:serialno,subloc:subloc,loc:loc})
    //                             .then(result => {
    //                                 console.log('*********8 ',result,result.n)
    //                                 if(result.n > 0){
    //                                     console.log('res.status(200).json({status:true, message: "stock details is deleted successfuly" });')
    //                                 }
    //                                 else{
    //                                     console.log('res.status(401).json({message: "something went wrong, while deleting stock details"})')
    //                                 }
    //                             })
    //                         }else{
    //                             console.log('res.status(404).json({message: "Error occurred, no stocks found for the provided id"});')
    //                         }
    //                     })
    //                 }else{
    //                     console.log('res.status(404).json({message: "Error occurred, no vendor invoices found for the provided id"});')
    //                 }
    //             })
    //         }else{
    //             res.status(404).json({message: "Error occurred, no product detail found for the provided id"}); 
    //         }
    //     }
    //     else{
    //         res.status(404).json({message: "Error occurred, no data foound for the provided id"});
    //     }
    // })
    // .catch(error => {
    //     res.status(500).json({
    //     message: "Fetching Vendor Invoice Product Detail failed!!"
    //     })
    // });
    // VendorInvoiceProductDetail.deleteOne({ _id: req.params.id, creator: req.userData.userId})
    // .then(result => {
    //     console.log('********* ',result)
    //     if(result.n > 0){
    //     res.status(200).json({ message: "Vendor Invoice Product Detail deleted!!" });
    //     }
    //     else{
    //     res.status(401).json({message: "!!!!!!!Not authorized!!"})
    //     }
        
    // })
    // .catch(error => {
    //     res.status(500).json({
    //     message: "Deleting a Vendor Invoice Product Detail failed!!"
    //     })
    // })
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
