const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productScehma = new Schema({
  id: { type: mongoose.SchemaTypes.ObjectId },
  number: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: String, required: true },
  sellPrice: { type: String },
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor", required: false },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Categories", required: false },
  imagePath: { type: String, required: false },
  cgst: { type: String, required: true },
  sgst: { type: String, required: true },
  // igst: { type: String },
  createdDate: {type: Date, required: false },
  modifiedDate: {type: Date, required: false },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
});

module.exports = mongoose.model('Product', productScehma);
