const { provideRoutes } = require('@angular/router');
const ClientPurchaseOrderDetail = require('../models/client-purchase-order-detail');
const ClientPaymentDetail = require('../models/client-payment-management');
const Product = require('../models/product');
const stock = require('../models/stock');
const stockDetail = require('../models/stock-detail');
const clientInvoiceDetail = require('../models/client-invoice');


exports.getAllClientPurchaseOrderDetails = (req, res, next) => {
    const pageSize = +req.query.pageSize;
    const currentPage = +req.query.page;
    const clientPurchaseOrderDetailQuery = ClientPurchaseOrderDetail.find();
    let fetchedClientPurchaseOrders;
    if(pageSize && currentPage){
        clientPurchaseOrderQuery
        .skip(pageSize * (currentPage - 1))
        .limit(pageSize);
    }
    clientPurchaseOrderDetailQuery
    .then(documents => {
    ClientPurchaseOrderDetail.countDocuments({}, function(err, count) {
        res.status(200).json({
        message: 'Client Purchase Order Detail send successfully!',
        clientPurchaseOrderDetails: documents,
        maxClientPurchaseOrderDetails: count
        });
    })
    .catch(error => {
        res.status(500).json({
        message: "Fetching a Client Purchase Order failed!!"
        })
    });

    });
}

exports.getAllClientPurchaseOrderDetail  = (req, res, next) => {
const pageSize = +req.query.pageSize;
    const currentPage = +req.query.page;
    const clientPODetailQuery = ClientPurchaseOrderDetail.find();
    let fetchedClients;
    if(pageSize && currentPage){
        clientPODetailQuery
        .skip(pageSize * (currentPage - 1))
        .limit(pageSize);
    }
    clientPODetailQuery
        .then(documents => {
            ClientPurchaseOrderDetail.countDocuments({}, function(err, count) {
            res.status(200).json({
            message: 'Client Purchase Order details send successfully!',
            ClientPurchaseOrderDetail: documents,
            maxClientPurchaseOrderDetail: count
            });
        })
        .catch(error => {
            res.status(500).json({
            message: "Fetching  Client PurchaseOrder details failed!!"
            })
        });
        
        });
    }

exports.saveClientPurchaseOrderDetail = (req,res,next) => {
    // const url = req.protocol + '://' + req.get("host");
    Product.find({number:req.body.productId}).then(product => {
        if(product){
            product[0].cgst = product[0].cgst ? product[0].cgst : 0;
            product[0].sgst = product[0].sgst ? product[0].sgst : 0;
            product[0].igst = product[0].igst ? product[0].igst : 0;
            let amt = parseInt(product[0].cgst)+parseInt(product[0].sgst)+parseInt(product[0].igst)+parseInt(product[0].price)
            let totalAmt = amt * parseInt(req.body.quantity)
            stock.find({product:product[0]._id}).then(stock => {
                if(stock){
                    stockDetail.find({stock:stock[0]._id},{serialno:1,subloc:1,loc:1}).then(stkDetial => {
                        if(stkDetial){
                             const clientPurchaseOrderDetail = new ClientPurchaseOrderDetail({
                                clientPOId: req.body.clientPOId,
                                productId : req.body.productId,
                                quantity: req.body.quantity,
                                scheduledDate: req.body.scheduledDate,
                                status: req.body.status,
                                creator: req.userData.userId,
                                amount: totalAmt,
                                serialnoDetials: stkDetial,
                                createdDate: Date.now()
                            });
                            clientPurchaseOrderDetail.save().then(createdClientPurchaseOrderDetail => {
                                res.status(201).json({
                                    status:true,
                                    message: 'Client Purchase Order Detail added successfully!!',
                                    clientPurchaseOrderDetail: {
                                        ...createdClientPurchaseOrderDetail,
                                        id: createdClientPurchaseOrderDetail._id,
                                    }
                                });
                            }).catch(error => {
                                console.log(error);
                                res.status(500).json({
                                    status:false,
                                    message: "Creating a Client Purchase Order Detail failed!!"
                                })
                            });
                        }else{
                            console.log('************stock detailss not found*********')
                        }
                    })
                }else{
                    console.log('************stock not found*********')
                }
            })
           
        }
        else{
            res.status(404).json({message: "Error occurred!!"});
        }
    })
    .catch(error => {
        res.status(500).json({
        message: "Fetching Product failed!!"
        })
    });       
    
}

exports.updateClientPurchaseOrderByInvoiceDetials = (req,res,next) => {
    // const url = req.protocol + '://' + req.get("host");
    const clientQuery = clientInvoiceDetail.find().sort({_id:-1});

    clientQuery.then((payCount) => {
        let invoice_no
        if(payCount.length == 0){
            invoice_no = 'invoice_no_0'
        }else{
            invoice_no = payCount[0].invoiceno ? payCount[0].invoiceno : 'invoice_no_0'
        }
        var lastDigit = invoice_no.toString().slice(11);
        const lastD = ++lastDigit;
        var invoiceNo = 'invoice_no_'+lastD;
        const clientPaymentObj = new clientInvoiceDetail({ 
            invoiceno: invoiceNo,
            totalamount: req.body.amount,
            clientPOId: req.body.clientPOId,
            creator: req.body.creator,
        });
        ClientPurchaseOrderDetail.updateOne({_id: req.params.id },{ $set:
            {
                isInvoiced:true,
                selectedSerialnoDetails: req.body.selectedSerialnoDetails,
                invoiceNo: invoiceNo
            }
         }).then(result => {
            if(result.n > 0){
                clientPaymentObj.save().then(clientInvoice => {

                   var yes =  req.body.selectedSerialnoDetails.map(item => item['serialno']);

                    ClientPurchaseOrderDetail.update(
                        { },
                        {"$pull":{"serialnoDetials":{"serialno":{$in:yes}}}},
                        { multi: true }
                    ).then(clientInvoice => {
                        console.log('####other records are updated#######',clientInvoice)
                    })
                    res.status(201).json({
                        status:true,
                        message: 'Client Invoice Detail added successfully!!',
                        clientInvoice: {
                            ...clientInvoice,
                            id: clientInvoice._id,
                        }
                    });
                }).catch(error => {
                    res.status(500).json({
                        status:false,
                        message: "Creating a Client Purchase Order Detail failed!!"
                    })
                });
            }
            else{
                res.status(401).json({status:false,message: "Not authorized!!"})
            }
        })
        .catch(error => {
            res.status(500).json({
                status:false,
                message: "Could not update client purchase order Detail"
            })
        })
    })
}

exports.removeStockDetialsAndStockQty = (req,res,next) => {
    Product.find({number:req.body.productId}).then(productDetials => {
        if(productDetials.length){
            stock.update({product:productDetials[0]._id},{$inc: {quantity: -req.body.quantity}}).then(stockCount => {
                if(stockCount){
                    var yes =  req.body.selectedSerialnoDetails.map(item => item['serialno']);
                    stockDetail.deleteMany({serialno:{$in:yes}}).then(deletedStockDetials => {
                        if(deletedStockDetials){
                            res.status(200).json({
                                status:true,
                                message: 'stock qty and stock detials are updated successfully!!',
                            });
                        }else{
                            res.status(500).json({
                                status:false,
                                message: "stock detials are not found to be deleted.!!"
                            })
                        }
                    })
                }else{
                    res.status(500).json({
                        status:false,
                        message: "stock quantity is not found to be updated.!!"
                    })
                }
            }).catch(error => {
                console.log(error);
                res.status(500).json({
                    status:false,
                    message: "erorr at stock qty update!!"
                })
            });
        }else{
            res.status(500).json({
                status:false,
                message: "Product Detail not found!!"
            })
        }
    }).catch(error => {
        console.log(error);
        res.status(500).json({
            status:false,
            message: "erorr at getting product detials.!!"
        })
    });
}

exports.getClientInvoiceNumber = (err,res) => {
    const clientQuery = clientInvoiceDetail.find().sort({_id:-1});

    clientQuery.then((payCount) => {
        let invoice_no
        if(payCount.length == 0){
            invoice_no = 'invoice_no_0'
        }else{
            invoice_no = payCount[0].invoiceno ? payCount[0].invoiceno : 'invoice_no_0'
        }
        var lastDigit = invoice_no.toString().slice(11);
        const lastD = ++lastDigit;
        var invoiceNo = 'invoice_no_'+lastD;
        res.json({status:true,invoiceNo:invoiceNo})
    })
}
exports.getSerialNoByProductId = (req,res,next)=>{
    Product.find({number:req.params.productId}).then(product => {
        stock.find({product:product[0]._id}).then(stock => {
            if(stock.length){
                stockDetail.find({stock:stock[0]._id},{_id:0,serialno:1,subloc:1,loc:1}).then(stockDetails => {
                    if(stockDetails.length){
                        const serialno = stockDetails.map(o => (o.serialno));
                        const loc = stockDetails.map(o => (o.loc));
                        const subloc = stockDetails.map(o => (o.subloc));
                        res.status(200).json({status:true,serialno:serialno,loc:loc,subloc:subloc,obj:stockDetails}); 
                    }else{
                        res.status(404).json({status:false,message: "no stock details found for the stock??"}); 
                    } 
                }) 
            }else{
                res.status(404).json({status:false,message: "no stock found for the stock!!!!"});  
            }
        })
    })
}

exports.updateClientPurchaseOrderDetail = (req, res, next) => {
    
    // const clientPurchaseOrderDetail = new ClientPurchaseOrderDetail({
    //     _id: req.body.id,
    //    productId : req.body.productId,
    //     quantity: req.body.quantity,
    //     scheduledDate: req.body.scheduledDate,
    //     status: req.body.status,
    //     creator: req.userData.userId,
    //     modifiedDate: Date.now()
    // })

        ClientPurchaseOrderDetail.updateOne({_id: req.params.id, creator: req.userData.userId }, req.body).then(result => {
            if(result.n > 0){
                res.status(200).json({status:true,message: "updated!!",result:result})
            }
            else{
                res.status(401).json({status:false,message: "Not authorized!!"})
            }
        })
        .catch(error => {
            res.status(500).json({
                status:false,
                message: "Could not update client purchase order Detail"
            })
        })
    }


// sngle record of PO delete; without taking into consideration of po_Details

exports.deleteClientPurchaseOrderDetail = (req, res, next) => {

ClientPurchaseOrderDetail.deleteOne({ _id: req.params.id, creator: req.userData.userId})
.then(result => {
    if(result.n > 0){
        res.status(200).json({ status:true, message: "ClientPurchaseOrder Detail deleted!!" });
    }
    else{
        res.status(401).json({status:false, message: "no record found for the given id"})
    }
})
.catch(error => {
    res.status(500).json({
    message: "Deleting a Client Purchase Order Detail failed!!"
    })
})
}

exports.getSingleClientPurchaseOrderDetail = (req, res, next) => {

    ClientPurchaseOrderDetail.findById(req.params.id).then(clientPurchaseOrderDetail => {
        if(clientPurchaseOrderDetail){
        res.status(200).json(clientPurchaseOrderDetail);
        }
        else{
        res.status(404).json({message: "Error occurred!!"});
        }
    })
    .catch(error => {
        res.status(500).json({
        message: "Fetching Client Purchase Order Detail failed!!"
        })
    });
}

exports.getClientPurchaseOrderByInvoiceDetials = (req, res, next) => {
    ClientPurchaseOrderDetail.find({_id:req.body._id,clientPOId:req.body.clientPOId,creator:req.body.creator}).then(clientPurchaseOrderDetail => {
        if(clientPurchaseOrderDetail){
          res.status(200).json(clientPurchaseOrderDetail);
        }
        else{
          res.status(404).json({message: "Error occurred!!"});
        }
    })
    .catch(error => {
        res.status(500).json({
        message: "Fetching Client Purchase Order Detail failed!!"
        })
    });
}