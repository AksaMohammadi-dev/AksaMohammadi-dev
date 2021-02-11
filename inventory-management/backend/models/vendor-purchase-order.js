const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const vendorPOScehma = new Schema({
  id: { type: mongoose.SchemaTypes.ObjectId },
  ponumber: { type: String, required: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: false },
  quantity: { type: String, required: true },
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor", required: false },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
  createdDate: {type: Date, required: false },
  modifiedDate: {type: Date, required: false },
});

module.exports = mongoose.model('VendorPurchaseOrder', vendorPOScehma);
