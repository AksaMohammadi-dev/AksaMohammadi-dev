const Client = require('../models/client');
  
exports.getAllClients = (req, res, next) => {
    const pageSize = +req.query.pageSize;
    const currentPage = +req.query.page;
    const clientQuery = Client.find();
    let fetchedClients;
    if(pageSize && currentPage){
        clientQuery
        .skip(pageSize * (currentPage - 1))
        .limit(pageSize);
    }
    clientQuery
        .then(documents => {
        Client.countDocuments({}, function(err, count) {
            res.status(200).json({
            message: 'Client send successfully!',
            clients: documents,
            maxClients: count
            });
        })
        .catch(error => {
            res.status(500).json({
            message: "Fetching a Client failed!!"
            })
        });
        
        });

}

exports.saveClient = (req,res,next) => {
    const url = req.protocol + '://' + req.get("host");
    const client = new Client({
        name: req.body.name,
        creator: req.userData.userId,
        createdDate: Date.now()
    });
    //console.log(client);
    client.save().then(createdClient => {
        res.status(201).json({
        message: 'Client added successfully!!',
        client: {
            ...createdClient,
            id: createdClient._id,
            }
        });
    })
    .catch(error => {
        console.log(error);
        res.status(500).json({
        message: "Creating a Client failed!!"
        })
    });
    
    }

exports.updateClient = (req, res, next) => {
    let imagePath = req.imagePath;
    if(req.file){
        const url = req.protocol + '://' + req.get("host");
        imagePath = url + "/images/" + req.file.filename
    }
    const client = new Client({
        _id: req.body.id,
        name: req.body.name,
        modifiedDate: Date.now()
    })
    
    Client.updateOne({_id: req.params.id, creator: req.userData.userId }, client).then(result => {
        if(result.n > 0){
        res.status(200).json({message: "updated!!"})
        }
        else{
        res.status(401).json({message: "Not authorized!!"})
        }
    })
    .catch(error => {
        res.status(500).json({
        message: "Could not update client"
        })
    })
    }

exports.deleteClient = (req, res, next) => {

Client.deleteOne({ _id: req.params.id, creator: req.userData.userId})
.then(result => {
    if(result.n > 0){
    res.status(200).json({ message: "Client deleted!!" });
    }
    else{
    res.status(401).json({message: "Not authorized!!"})
    }
    
})
.catch(error => {
    res.status(500).json({
    message: "Deleting a Client failed!!"
    })
})
}

exports.getSingleClient = (req, res, next) => {

    Client.findById(req.params.id).then(client => {
        if(client){
        res.status(200).json(client);
        }
        else{
        res.status(404).json({message: "Error occurred!!"});
        }
    })
    .catch(error => {
        res.status(500).json({
        message: "Fetching Client failed!!"
        })
    });
}