const { provideRoutes } = require('@angular/router');
const ClientPayment = require('../models/client-payment-management');
const Product = require('../models/product');
const stock = require('../models/stock');
const stockDetail = require('../models/stock-detail');
const ClientPurchaseOrder = require('../models/client-purchase-order');
const ClientPurchaseOrderDetial = require('../models/client-purchase-order-detail');

exports.getAllClientPaymentDetails = (req, res, next) => {
    const pageSize = +req.query.pageSize;
    const currentPage = +req.query.page;
    // const clientPaymentMgmtQuery = ClientPayment.find();
    const clientPaymentMgmtQuery = ClientPayment.aggregate([
        { $lookup:
            {
               from: "clients",
               localField: "client",
               foreignField: "_id",
               as: "clientDetails"
            }
        }
    ])
    let fetchedClientPayments;
    if(pageSize && currentPage){
        clientPaymentQuery
        .skip(pageSize * (currentPage - 1))
        .limit(pageSize);
    }
    clientPaymentMgmtQuery
    .then(documents => {
    ClientPayment.countDocuments({}, function(err, count) {
        res.status(200).json({
        message: 'Client Purchase Order Detail send successfully!',
        ClientPayments: documents,
        maxClientPayments: count
        });
    })
    .catch(error => {
        res.status(500).json({
        message: "Fetching a Client Payments failed!!"
        })
    });

    });
}

exports.clientInvoices = (req, res, next) => {
    // ClientPurchaseOrder.find({creator:req.params.client_id}).then(documents => {
    //     res.status(200).json({
    //         message: 'Client Purchase Order Detail send successfully!',
    //         clientPO: documents
    //     });
    // })
    // .catch(error => {
    //     res.status(500).json({
    //     message: "Fetching a Client Payments failed!!"
    //     })
    // });
    const Query =  ClientPurchaseOrder.aggregate([
        { $match: {"creator": ObjectId(req.params.client_id)} },
        { $lookup:
            {
               from: "clientpurchaseorderdetials",
               localField: "_id",
               foreignField: "clientPOId",
               as: "productDetails"
            }
        }
    ])
    Query.then(documents => {
        var keyArray = [];
        documents.forEach(element => {
            keyArray.push(element.productDetails.map(function(item) { if(item['isInvoiced']){
                return item["invoiceNo"]
            } }))
        });
            res.status(200).json({
                status:true,
                message: 'Stocks details send successfully!',
                details: documents,
                invoices : keyArray
            });
        })
        .catch(error => {
            res.status(500).json({
                status:false,
                message: "Fetching  Stock details failed!!"
            })
        });
}

exports.getAllClientPaymentDetail  = (req, res, next) => {
const pageSize = +req.query.pageSize;
    const currentPage = +req.query.page;
    const clientPaymentQuery = ClientPaymentDetail.find();
    let fetchedClients;
    if(pageSize && currentPage){
        clientPaymentQuery
        .skip(pageSize * (currentPage - 1))
        .limit(pageSize);
    }
    clientPaymentQuery
        .then(documents => {
            ClientPaymentDetail.countDocuments({}, function(err, count) {
            res.status(200).json({
            message: 'Client Payment details send successfully!',
            ClientPaymentDetail: documents,
            maxClientPaymentDetail: count
            });
        })
        .catch(error => {
            res.status(500).json({
            message: "Fetching  Client Payment details failed!!"
            })
        });
        
        });
    }

exports.createClientPayment = (req, res, next)=>{  

    const client_payemnt = new ClientPayment({
        ponumber: req.body.ponumber,
        invoicenumber: req.body.invoicenumber,
        amount: req.body.amount,
        totalAmount: req.body.totalAmount,
        bal: req.body.bal,
        client: req.body.client,
        modeofpayment: req.body.modeofpayment,
        paymentslipref: req.body.paymentslipref,
        paymentlocation: req.body.paymentlocation,
        paymentDate : req.body.paymentDate,
        remark: req.body.remark
    });

    client_payemnt.save()
        .then(result => {
            res.status(200).json({
                message: 'client invoice payment is created successfully!',
                result: result,
                });
        })
        .catch(err => {
            res.status(500).json({
                    message: "an error occured.!"
                });
        });
    
}

exports.saveClientInvoiceDetail = (req,res,next) => {
    const url = req.protocol + '://' + req.get("host");
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

exports.updateClientPaymentDetail = (req, res, next) => {
    
    // const clientPurchaseOrderDetail = new ClientPurchaseOrderDetail({
    //     _id: req.body.id,
    //    productId : req.body.productId,
    //     quantity: req.body.quantity,
    //     scheduledDate: req.body.scheduledDate,
    //     status: req.body.status,
    //     creator: req.userData.userId,
    //     modifiedDate: Date.now()
    // })

        ClientPaymentDetail.updateOne({_id: req.params.id, creator: req.userData.userId }, req.body).then(result => {
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
                message: "Could not update client payment Detail"
            })
        })
    }


// sngle record of PO delete; without taking into consideration of po_Details

exports.deleteClientPaymentDetail = (req, res, next) => {

ClientPaymentDetail.deleteOne({ _id: req.params.id, creator: req.userData.userId})
.then(result => {
    if(result.n > 0){
        res.status(200).json({ status:true, message: "client payment Detail deleted!!" });
    }
    else{
        res.status(401).json({status:false, message: "no record found for the given id"})
    }
})
.catch(error => {
    res.status(500).json({
    message: "Deleting a Client payment Order Detail failed!!"
    })
})
}

exports.getSingleClientPaymentDetail = (req, res, next) => {

    ClientPayment.find({invoicenumber:req.params.id}).then(clientPaymentDetail => {
        if(clientPaymentDetail){
        res.status(200).json({status:true,data:clientPaymentDetail});
        }
        else{
        res.status(404).json({status:false,message: "Error occurred!!"});
        }
    })
    .catch(error => {
        res.status(500).json({
            status:false,
            message: "Fetching Client Payment Detail failed!!"
        })
    });
}

// exports.clientInvoices = (req, res, next) => {
//     ClientPurchaseOrder.find({creator:req.params.client_id}).then(documents => {
//         res.status(200).json({
//             message: 'Client Purchase Order Detail send successfully!',
//             clientPO: documents
//         });
//     })
//     .catch(error => {
//         res.status(500).json({
//         message: "Fetching a Client Payments failed!!"
//         })
//     });

// }