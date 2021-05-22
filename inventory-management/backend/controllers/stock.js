const Stock = require('../models/stock');
const stockDetail = require('../models/stock-detail');
ObjectId = require('mongodb').ObjectID;
const Product = require('../models/product');
const stock = require('../models/stock');

exports.getAllStocks = (req, res, next) => {
    const pageSize = +req.query.pageSize;
    const currentPage = +req.query.page;
    // const StockQuery = Stock.find();
    const StockQuery =  Stock.aggregate([
        { $lookup:
            {
               from: "products",
               localField: "product",
               foreignField: "_id",
               as: "productDetails"
            }
        }
    ])
    let fetchedClients;
    if(pageSize && currentPage){
        StockQuery
        .skip(pageSize * (currentPage - 1))
        .limit(pageSize);
    }
    StockQuery
        .then(documents => {
        Stock.countDocuments({}, function(err, count) {
            res.status(200).json({
            message: 'Stocks details send successfully!',
            Stock: documents,
            maxStock: count
            });
        })
        .catch(error => {
            res.status(500).json({
            message: "Fetching  Stock details failed!!"
            })
        });
        
        });

    // Stock.aggregate([
    //     { $lookup:
    //         {
    //            from: "products",
    //            localField: "product",
    //            foreignField: "_id",
    //            as: "productDetails"
    //         }
    //     }
    // ]).then(documents => {
    //     res.status(200).send({'%%%%%%%%%%%%result':documents})
    // }).catch((err)=>{
    //     res.status(201).send({'WWWWWWeerrorrWWWWWWw':err})
    // })



}

exports.getAllStocksStockDetialsProductDetials = (req, res, next) => {
    const StockQuery = Stock.find();
    StockQuery
        .then(documents => {
        var stockDetails = [];
            let count = 0;
            documents.forEach(element => {
                var obj = {}
                stockDetail.findOne({'stock':element._id}, function (err, docs) { 
                    Product.findById(element.product).then(product => {
                        obj.product = product
                        count++;
                        obj.stock = element
                        obj.stockDetail = docs
                        stockDetails.push(obj)
                        if(count == documents.length){
                            res.status(200).json({
                                message: 'Stocks details send successfully!',
                                stockDetails: stockDetails
                                }); 
                        }
                    })
                })
            })            
        });

}

exports.getAllStocksAndStockDetials = (req, res, next) => {
    const StockQuery = Stock.find({});
    
    StockQuery
        .then(documents => {
            let ids = documents.map(a => a._id);
        var stockDetails = [];
            let count = 0;
            stockDetail.find( { "stock": { $in: ids } } , function (err, docs) { 
            })
            // documents.forEach(element => {
            //     var obj = {}
            //     stockDetail.findOne({'stock':element._id}, function (err, docs) { 
            //         count++;
            //         obj.stock = element
            //         obj.stockDetail = docs
            //         stockDetails.push(obj)
            //         if(count == documents.length){
            //             res.status(200).json({
            //                 message: 'Stocks details send successfully!',
            //                 stockDetails: stockDetails
            //                 }); 
            //         }
            //     })
            // })            
        });

}

exports.getStockDetailsByStockId = (req, res, next) => {
    stockDetail.find({"stock":req.params.stockId}).then(result => {
        if(result){
            res.status(200).json(result);
        }
        else{
            res.status(404).json({message: "Error occurred!!"});
        }
    })
    .catch(error => {
        res.status(500).json({
        message: "Fetching stock Detail failed!!"
        })
    });
}

exports.updateLocationsForProduct = (req, res, next) => {
    var obj;
    var obj1 = req.body.newData
    if(req.body.newData){
        if(req.body.newData.loc == 'undefined'){
            delete req.body.newData.loc
        }
        if(req.body.newData.subloc == 'undefined'){
            delete req.body.newData.subloc
        }
        stockDetail.updateMany({serialno:req.body.serialno},{ $set : req.body.newData}).then(result => { //serial no is ony enough since serail no is unique for every record
            if(result){
                res.status(200).json({status:true,message:result});
            }
            else{
                res.status(404).json({status:false,message: "Error occurred!!"});
            }
        })
        .catch(error => {
            res.status(500).json({
                message: "updating stock Detail for location of productss failed!!"
            })
        });
    }else{
        res.status(500).json({
            message: "mandatory feilds are missing"
        })
    }
}