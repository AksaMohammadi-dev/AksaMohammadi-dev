const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator')

const vendorInvoiceScehma = new Schema({
  id: { type: mongoose.SchemaTypes.ObjectId },
  invoiceno: { type: String, required: true },
  totalamount: { type: String, required: true },
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor", required: false },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
  createdDate: {type: Date, required: false },
  modifiedDate: {type: Date, required: false },
});


module.exports = mongoose.model('VendorInvoice', vendorInvoiceScehma);