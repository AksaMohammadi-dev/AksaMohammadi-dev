const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const stockDetailScehma = new Schema({
  id: { type: mongoose.SchemaTypes.ObjectId },
  serialno: { type: String, required: true },
  subloc: { type: String, required: true },
  loc: { type: String, required: true },  
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
  stock: { type: mongoose.Schema.Types.ObjectId, ref: "Stock", required: false },
  vendorinvoiceproductdetail: { type: mongoose.Schema.Types.ObjectId, ref: "VendorInvoiceProductDetail", required: false },
  createdDate: {type: Date, required: false },
  modifiedDate: {type: Date, required: false },
});


module.exports = mongoose.model('StockDetail', stockDetailScehma)