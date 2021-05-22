const Vendor = require('../models/vendor');
const Client = require('../models/client');
const Categories = require('../models/category')
const Product = require('../models/product')
const VendorPurchaseOurder = require('../models/vendor-purchase-order')
const ClientPurchaseOrder = require('../models/client-purchase-order')
const VendorInvoice = require('../models/vendor-invoice')
const locationsEventHandler = require('../eventHandler/locations')
async function getMetaData (req, res, next) {
   
    try {
        let vendorsRes;
        let clientsRes;
        let subLocRes;
        let locsRes;
        let categoryRes;
        let productsRes;
        let vendorPOCntRes;
        let clientPOCntRes;

        vendorsRes = await getVendors(req, res, next)
        clientsRes = await getClients(req, res, next)
        subLocRes = await getSubLocations(req, res, next)
        locsRes = await getLocations(req, res, next)
        categoryRes = await getCategory(req, res, next)
        productsRes = await getProducts(req, res, next);
        vendorPOCntRes = await getVendorPurchaseOrderCount(req, res, next);
        productCntRes = await getProductCount(req, res, next);
        clientPOCntRes = await getClientPurchaseOrderCount(req, res, next);

        res.json({ 
            vendors: vendorsRes, 
            clients: clientsRes,
            subLocs: subLocRes,
            locs: locsRes,
            categories: categoryRes,
            products: productsRes,
            vendorPOCnt: vendorPOCntRes,
            clientPOCnt: clientPOCntRes,
            productCnt : productCntRes
        })
      }
      catch(error) {
        console.log(error)
        res.status(500).json({ error: 'There was an error' })
      }

}


async function getVendorPaymentMetaData (req, res, next) {
   
    try {
        let vendorsRes;
        let pORes;

        vendorsRes = await getVendors(req, res, next)
        pORes = await getVendorPurchaseOrder(req, res, next);
        vendorInvoiceRes = await getVendorInvoice(req, res, next);

        res.json({ 
            vendors: vendorsRes,
            purchaseOrders: pORes,
            vendorInvoices: vendorInvoiceRes
        })
      }
      catch(error) {
        console.log(error)
        res.status(500).json({ error: 'There was an error' })
      }

}

async function getVendors(req, res, next) {

    const vendorQuery = Vendor.find();

    return vendorQuery;
}


async function getClients(req, res, next) {

    const clientQuery = Client.find();
    return clientQuery;
}

async function getCategory(req, res, next) {

    const categoryQuery = Categories.find();
    return categoryQuery;
}

async function getVendorPurchaseOrder(req, res, next) {

    const vendorPOQuery = VendorPurchaseOurder.find();
    return vendorPOQuery;
}

// async function getclientPurchaseOrder(req, res, next) {

//     const clientPOQuery = ClientPurchaseOrder.find();
//     return clientPOQuery;
// }

async function getVendorInvoice(req, res, next) {

    const vendorInvoiceQuery = VendorInvoice.find();
    return vendorInvoiceQuery;
}

async function getVendorPurchaseOrderCount(req, res, next) {

    const vendorPOQuery = VendorPurchaseOurder.countDocuments();
    return vendorPOQuery;
}

async function getClientPurchaseOrderCount(req, res, next) {

    const clientPOQuery = ClientPurchaseOrder.countDocuments();
    return clientPOQuery;
}
async function getProductCount(req, res, next) {

    const productQuery = Product.countDocuments();
    return productQuery;
}

async function getLocations(req, res, next) {

    const locs = locationsEventHandler.location;
    return locs;
}

async function getSubLocations(req, res, next) {

    const subLocs = locationsEventHandler.sublocation;

    return subLocs;
}

async function getProducts(req, res, next) {

    const productQuery = Product.find();
    return productQuery;
}


module.exports.getMetaData = getMetaData;
module.exports.getVendorPaymentMetaData = getVendorPaymentMetaData;