const Product = require('../models/product');
  
exports.getAllProducts = (req, res, next) => {
    const pageSize = +req.query.pageSize;
    const currentPage = +req.query.page;
    const productQuery = Product.find();
    let fetchedProducts;
    if(pageSize && currentPage){
        productQuery
        .skip(pageSize * (currentPage - 1))
        .limit(pageSize);
    }
    productQuery
        .then(documents => {
        Product.countDocuments({}, function(err, count) {
            res.status(200).json({
            message: 'Product send successfully!',
            products: documents,
            maxProducts: count
            });
        })
        .catch(error => {
            res.status(500).json({
            message: "Fetching a Product failed!!"
            })
        });
        
        });

}

exports.saveProduct = (req,res,next) => {
    const url = req.protocol + '://' + req.get("host");
    const product = new Product({
        number: req.body.number,
        description: req.body.description,
        cgst: req.body.cgst,
        sgst: req.body.sgst,
        price: req.body.price,
        creator: req.userData.userId,
        createdDate: Date.now(),
        imagePath: url + "/images/" + req.file.filename,
        vendor: req.body.vendor,
        category: req.body.categpry
    });
    product.save().then(createdProduct => {
        res.status(201).json({
        message: 'Product added successfully!!',
        product: {
            ...createdProduct,
            id: createdProduct._id,
            }
        });
    })
    .catch(error => {
        console.log(error);
        res.status(500).json({
        message: "Creating a Product failed!!"
        })
    });
    
    }

exports.updateProduct = (req, res, next) => {
    let imagePath = req.imagePath;
    if(req.file){
        const url = req.protocol + '://' + req.get("host");
        imagePath = url + "/images/" + req.file.filename
    }
    const product = new Product({
        _id: req.body.id,
        number: req.body.number,
        description: req.body.description,
        cgst: req.body.cgst,
        sgst: req.body.sgst,
        price: req.body.price,
        modifiedDate: Date.now(),
        imagePath: imagePath,
        vendor: req.body.vendor,
        category: req.body.category
    })

    Product.updateOne({_id: req.params.id, creator: req.userData.userId }, product).then(result => {
        if(result.n > 0){
        res.status(200).json({message: "updated!!"})
        }
        else{
        res.status(401).json({message: "Not authorized!!"})
        }
    })
    .catch(error => {
        res.status(500).json({
        message: "Could not update product"
        })
    })
}

exports.deleteProduct = (req, res, next) => {

Product.deleteOne({ _id: req.params.id, creator: req.userData.userId})
.then(result => {
    if(result.n > 0){
    res.status(200).json({ message: "Product deleted!!" });
    }
    else{
    res.status(401).json({message: "Not authorized!!"})
    }
    
})
.catch(error => {
    res.status(500).json({
    message: "Deleting a Product failed!!"
    })
})
}

exports.getSingleProduct = (req, res, next) => {

    Product.findById(req.params.id).then(product => {
        if(product){
        res.status(200).json(product);
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

exports.updateProductSellPrice = (req, res, next) => {
    let imagePath = req.imagePath;
    if(req.file){
        const url = req.protocol + '://' + req.get("host");
        imagePath = url + "/images/" + req.file.filename
    }
    const product = new Product({
        _id: req.body.id,
        number: req.body.number,
        description: req.body.description,
        cgst: req.body.cgst,
        sgst: req.body.sgst,
        price: req.body.price,
        modifiedDate: Date.now()
    })
    
    Product.updateOne({_id: req.params.id, creator: req.body.creator },  {
        $set: { sellPrice: req.body.sellPrice }
      }).then(result => {
        if(result.n > 0){
        res.status(200).json({message: "updated!!"})
        }
        else{
        res.status(401).json({message: "Not authorized!!"})
        }
    })
    .catch(error => {
        res.status(500).json({
        message: "Could not update sell price"
        })
    })
}

