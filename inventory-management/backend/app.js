const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

const productsRoutes = require('./routes/products');
const userRoutes = require('./routes/user');
const vendorsRoutes = require('./routes/vendors');
const clientsRoutes = require('./routes/clients');
const stockRoutes = require('./routes/stock');
const customerRoutes = require('./routes/customer');
const employeeRoutes = require('./routes/employee');
const vendorInvoiceRoutes = require('./routes/vendor-invoice');
const metaDataRoutes = require('./routes/meta-data');
const categoryRoutes = require('./routes/category');
const vendorPurchaseOrderRoutes = require('./routes/vendor-purchase-order');
const vendorPaymentManagementRoutes = require('./routes/vendor-payment-management');
const clientPurchaseOrderRoutes = require('./routes/client-purchase-order');
const clientPurchaseOrderDetailRoutes = require('./routes/client-purchase-order-detail');
const clientPaymentManagementRoutes = require('./routes/client-payment-management');


const app = express();
//const mongoUrl = "mongodb+srv://amey: " + process.env.MONGO_ATLAS_PW + "@cluster0-o10jq.mongodb.net/test?retryWrites=true&w=majority";
const mongoUrl = "mongodb://localhost:27017/shopping-cart"; //local mongo db

mongoose.connect(mongoUrl, {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => {
  console.log('Connected to db');
})
.catch(() => {
  console.log('Connected to db failed!!');
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
//app.use("/images",express.static(path.join("backend/images"))); //used in-case of separate app
app.use("/",express.static(path.join(__dirname, "angular"))); //used in-case of single app, angular is folder which contains UI build
app.use("/images",express.static(path.join(__dirname, "images"))); //used in-case of single app

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, PUT, OPTIONS");
  next();
})

app.use("/api/product", productsRoutes);
app.use("/api/user", userRoutes);
app.use("/api/vendor", vendorsRoutes);
app.use("/api/vendor-invoice", vendorInvoiceRoutes);
app.use("/api/client", clientsRoutes);
app.use("/api/stock", stockRoutes);
app.use("/api/customer", customerRoutes);
app.use("/api/employee", employeeRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/meta-data", metaDataRoutes);
app.use("/api/vendor-purchase-order", vendorPurchaseOrderRoutes);
app.use("/api/vendor-payment-management", vendorPaymentManagementRoutes);
app.use("/api/client-purchase-order", clientPurchaseOrderRoutes);
app.use("/api/client-purchase-order-detail", clientPurchaseOrderDetailRoutes);
app.use("/api/client-payment-management", clientPaymentManagementRoutes);

//code for single app
app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, "angular", "index.html"))
})
module.exports = app
