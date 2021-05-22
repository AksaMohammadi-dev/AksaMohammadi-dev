const ClientPurchaseOrder = require('../models/client-purchase-order');
const ClientPurchaseOrderDetial = require('../models/client-purchase-order-detail');

  
exports.getAllClientPurchaseOrders = (req, res, next) => {
    const pageSize = +req.query.pageSize;
    const currentPage = +req.query.page;
    const clientPurchaseOrderQuery = ClientPurchaseOrder.find();
    let fetchedClientPurchaseOrders;
    if(pageSize && currentPage){
        clientPurchaseOrderQuery
        .skip(pageSize * (currentPage - 1))
        .limit(pageSize);
    }
    clientPurchaseOrderQuery
        .then(documents => {
        ClientPurchaseOrder.countDocuments({}, function(err, count) {
            res.status(200).json({
                status:true,
                message: 'Client Purchase Order send successfully!',
                clientPurchaseOrders: documents,
                maxClientPurchaseOrders: count
            });
        })
        .catch(error => {
            res.status(500).json({
                status:false,
                message: "Fetching a Client Purchase Order failed!!"
            })
        });
        
        });

}

exports.getAllClientPurchaseOrder  = (req, res, next) => {
const pageSize = +req.query.pageSize;
    const currentPage = +req.query.page;
    const clientQuery = ClientPurchaseOrder.find();
    let fetchedClients;
    if(pageSize && currentPage){
        clientQuery
        // .skip(pageSize)
        .limit(currentPage);
    }
    clientQuery
        .then(documents => {
            ClientPurchaseOrder.countDocuments({}, function(err, count) {
            res.status(200).json({
                status:true,
                message: 'ClientPurchaseOrder details send successfully!',
                ClientPurchaseOrder: documents,
                maxClientPurchaseOrder: count
            });
        })
        .catch(error => {
            res.status(500).json({
                status:false,
                message: "Fetching  ClientPurchaseOrder details failed!!"
            })
        });
        
        });
    }

let ponumber;
exports.saveClientPurchaseOrder = (req,res,next) => {
    // const url = req.protocol + '://' + req.get("host");
    const clientQuery = ClientPurchaseOrder.find().sort({_id:-1});

    clientQuery.then((POCount) => {
        let po_num
        if(POCount.length == 0){
            po_num = 'PO_num0'
        }else{
            po_num = POCount[0].ponumber ? POCount[0].ponumber : 'PO_num0'
        }
        var lastDigit = po_num.toString().slice(6);
        const lastD = ++lastDigit;
        req.body.ponumber = 'PO_num'+lastD;
        const clientPurchaseOrder = new ClientPurchaseOrder({
            ponumber: req.body.ponumber,
            createdDate: Date.now(),
            creator: req.userData.userId,
            createdDate: Date.now()
        });
        
        clientPurchaseOrder.save().then(createdClientPurchaseOrder => {
            res.status(201).json({
                status:true,
                message: 'Client Purchase Order added successfully!!',
                clientPurchaseOrder: {
                    ...createdClientPurchaseOrder,
                    id: createdClientPurchaseOrder._id,
                }
            });
        }).catch(error => {
            res.status(500).json({
            message: "Creating a Client Purchase Order failed!!"
            })
        });
    })    
}

// exports.updateClientPurchaseOrder = (req, res, next) => {
    
//     const clientPurchaseOrder = new ClientPurchaseOrder({
//         _id: req.body.id,
//         ponumber: req.body.ponumber,,
//         creator: req.userData.userId,
//         modifiedDate: Date.now()
//     })

//     ClientPurchaseOrder.updateOne({_id: req.params.id, creator: req.userData.userId }, clientPurchaseOrder).then(result => {
//         if(result.n > 0){
//         res.status(200).json({message: "updated!!"})
//         }
//         else{
//         res.status(401).json({message: "Not authorized!!"})
//         }
//     })
//     .catch(error => {
//         res.status(500).json({
//         message: "Could not update client purchase order"
//         })
//     })
//     }


// sngle record of PO delete; without taking into consideration of po_Detials
exports.deleteClientPurchaseOrder = (req, res, next) => {
    ClientPurchaseOrder.deleteOne({ _id: req.params.id})
    .then(result => {
        if(result.n > 0){
            ClientPurchaseOrderDetial.deleteMany({ clientPOId: req.params.id, creator: req.userData.userId}).then(result => {
                if(result){
                    res.status(200).json({ status:true,message: "ClientPurchaseOrder and purchase order details has been deleted!!" });
                }
                else{
                    res.status(401).json({status:false,message: "Not authorized!!"})
                }
            })
            .catch(error => {
                res.status(500).json({
                message: "Deleting a Client Purchase Order failed!!"
                })
            })
        }
        else{
            res.status(401).json({status:false,message: "Not authorized!!"})
        }
    })
    .catch(error => {
        res.status(500).json({
        message: "Deleting a Client Purchase Order failed!!"
        })
    })
}

exports.getSingleClientPurchaseOrder = (req, res, next) => {

    ClientPurchaseOrder.findById(req.params.id).then(clientPurchaseOrder => {
        if(clientPurchaseOrder){
        ClientPurchaseOrderDetial.find({clientPOId:req.params.id}).then(clientPurchaseOrderDetails => {
                if(clientPurchaseOrderDetails){
                    res.status(200).json({
                        status:true,
                        clientPurchaseOrder:clientPurchaseOrder,
                        clientPurchaseOrderDetails:clientPurchaseOrderDetails
                    });
                }
                else{
                    res.status(404).json({message: "Error occurred!!"});
                }
            }).catch(error => {
                res.status(500).json({
                message: "Fetching Client Purchase Order failed!!"
                })
            });
        }
        else{
            res.status(404).json({message: "Error occurred!!"});
        }
    })
    .catch(error => {
        res.status(500).json({
        message: "Fetching Client Purchase Order failed!!"
        })
    });
}

exports.getClientPOByClientId = (req, res, next) => {
    ClientPurchaseOrder.find({creator:req.params.clientId}).then(clientPurchaseOrder => {
        if(clientPurchaseOrder){
            res.status(200).json({
                status:true,
                clientPurchaseOrder:clientPurchaseOrder,
            });
        }
        else{
            res.status(404).json({message: "Error occurred!!"});
        }
    })
    .catch(error => {
        res.status(500).json({
        message: "Fetching Client Purchase Order failed!!"
        })
    });
}

exports.getPOforPO_num = (req, res, next) => {
    // ClientPurchaseOrder.aggregate([
    //     {
    //         $match: { "ponumber": {"$in": req.body.ponumber} }
    //     },
    //     { "$lookup": { 
    //         "from": ClientPurchaseOrderDetial,
    //         "localField": "_id",
    //         "foreignField": "clientPOId",
    //         "as": "response"
    //       }
    //  }
    // ]).then(clientPurchaseOrder => {
    //     if(clientPurchaseOrder){
    //         res.status(200).json({
    //             status:true,
    //             clientPurchaseOrder:clientPurchaseOrder,
    //         });
    //     }
    //     else{
    //         res.status(404).json({message: "Error occurred!!"});
    //     }
    // })
    // .catch(error => {
    //     res.status(500).json({
    //     message: "Fetching Client Purchase Order failed!!"
    //     })
    // });
    
    
    ClientPurchaseOrder.find({"_id": {"$in": req.body.ponumber}}).then(clientPurchaseOrder => {
        if(clientPurchaseOrder){
            var count = 0;
            var obj = [];
            clientPurchaseOrder.forEach(element => {
                ClientPurchaseOrderDetial.find({"clientPOId": element._id}).then(details => {
                    let result1 = details.filter(item => {
                        if(item.selectedSerialnoDetails.length >0){
                            // item.selectedSerialnoDetails.filter(obj => {
                            //     return obj.serialno
                            // })
                            item.selectedSerialnoDetails.map(function (el) { return el.serialno; });
                        }else{
                            return undefined;
                        }
                    });
                    const result = details.filter(res=>res._id).map(ele=>{
                        const first = ele.selectedSerialnoDetails.filter(res=>res._id).map(ele1=>{
                            return ele1.serialno
                        })
                        return first;
                    });
                    // var merged = [].concat.apply([], result);
                    console.log(result,result1 );
                    obj.push({
                        clientPurchaseOrder:element,
                        clientPurchaseOrderDetails:details,
                        serialno : result
                    });
                    count++;
                    if(count == clientPurchaseOrder.length ){
                        res.send(obj)
                    } 
                })
            });
            
        }
        else{
            res.status(404).json({message: "Error occurred!!"});
        }
    })
    .catch(error => {
        res.status(500).json({
        message: "Fetching Client Purchase Order failed!!"
        })
    });
}