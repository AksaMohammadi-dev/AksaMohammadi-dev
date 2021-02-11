const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const vendorInvoiceProductDetailScehma = new Schema({
  id: { type: mongoose.SchemaTypes.ObjectId },
  serialno: { type: String, required: true },
  subloc: { type: String, required: true },
  loc: { type: String, required: true },  
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
  stockId: { type: mongoose.Schema.Types.ObjectId, ref: "Stock", required: false },
  vendorinvoicedetail: { type: mongoose.Schema.Types.ObjectId, ref: "VendorInvoiceDetail", required: false },
});


module.exports = mongoose.model('VendorInvoiceProductDetail', vendorInvoiceProductDetailScehma);