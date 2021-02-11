const Categories = require('../models/category');
  
exports.getAllCategorys = (req, res, next) => {
    const pageSize = +req.query.pageSize;
    const currentPage = +req.query.page;
    const categoryQuery = Categories.find();
    let fetchedCategorys;
    if(pageSize && currentPage){
        categoryQuery
        .skip(pageSize * (currentPage - 1))
        .limit(pageSize);
    }
    categoryQuery
        .then(documents => {
            Categories.countDocuments({}, function(err, count) {
            res.status(200).json({
            message: 'Category send successfully!',
            categorys: documents,
            maxCategorys: count
            });
        })
        .catch(error => {
            res.status(500).json({
            message: "Fetching a Category failed!!"
            })
        });
        
        });

}

exports.saveCategory = (req,res,next) => {
    const url = req.protocol + '://' + req.get("host");
    const category = new Categories({
        name: req.body.name,
        creator: req.userData.userId,
        createdDate: Date.now(),
        parentCategory: req.body.parentCategory ? req.body.parentCategory : null
    });
    //console.log(category);
    category.save().then(createdCategory => {
        res.status(201).json({
        message: 'Category added successfully!!',
        category: {
            ...createdCategory,
            id: createdCategory._id,
            }
        });
    })
    .catch(error => {
        console.log(error);
        res.status(500).json({
        message: "Creating a Category failed!!"
        })
    });
    
    }

exports.updateCategory = (req, res, next) => {
    let imagePath = req.imagePath;
    if(req.file){
        const url = req.protocol + '://' + req.get("host");
        imagePath = url + "/images/" + req.file.filename
    }
    const category = new Category({
        _id: req.body.id,
        name: req.body.name,
        modifiedDate: Date.now()
    })
    
    Categories.updateOne({_id: req.params.id, creator: req.userData.userId }, category).then(result => {
        if(result.n > 0){
        res.status(200).json({message: "updated!!"})
        }
        else{
        res.status(401).json({message: "Not authorized!!"})
        }
    })
    .catch(error => {
        res.status(500).json({
        message: "Could not update category"
        })
    })
    }

exports.deleteCategory = (req, res, next) => {

    Categories.deleteOne({ _id: req.params.id, creator: req.userData.userId})
.then(result => {
    if(result.n > 0){
    res.status(200).json({ message: "Category deleted!!" });
    }
    else{
    res.status(401).json({message: "Not authorized!!"})
    }
    
})
.catch(error => {
    res.status(500).json({
    message: "Deleting a Category failed!!"
    })
})
}

exports.getSingleCategory = (req, res, next) => {

    Categories.findById(req.params.id).then(category => {
        if(category){
        res.status(200).json(category);
        }
        else{
        res.status(404).json({message: "Error occurred!!"});
        }
    })
    .catch(error => {
        res.status(500).json({
        message: "Fetching Category failed!!"
        })
    });
}