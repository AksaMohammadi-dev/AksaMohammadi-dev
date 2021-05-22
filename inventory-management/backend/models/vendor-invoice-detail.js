const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const vendorInvoiceDetailScehma = new Schema({
  id: { type: mongoose.SchemaTypes.ObjectId },
  quantity: { type: Number, required: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  stockId: { type: mongoose.Schema.Types.ObjectId, ref: "Stock", required: false },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
  vendorinvoice: { type: mongoose.Schema.Types.ObjectId, ref: "VendorInvoice", required: false },
});


module.exports = mongoose.model('VendorInvoiceDetail', vendorInvoiceDetailScehma);