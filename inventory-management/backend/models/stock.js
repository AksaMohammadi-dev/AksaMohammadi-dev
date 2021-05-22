const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const stockScehma = new Schema({
  id: { type: mongoose.SchemaTypes.ObjectId },
  quantity: { type: Number, required: true },
  quantityPO: { type: String, required: false },
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  vendorinvoicedetail: { type: mongoose.Schema.Types.ObjectId, ref: "VendorInvoiceDetail", required: false },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
  createdDate: {type: Date, required: false },
  modifiedDate: {type: Date, required: false },
});


module.exports = mongoose.model('Stock', stockScehma);