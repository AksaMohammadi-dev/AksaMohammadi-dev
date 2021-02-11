const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const vendorScehma = new Schema({
  id: { type: mongoose.SchemaTypes.ObjectId },
  name: { type: String, required: true },
  createdDate: {type: Date, required: false },
  modifiedDate: {type: Date, required: false },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
});

module.exports = mongoose.model('Vendor', vendorScehma);
