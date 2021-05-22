const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const clientPOScehma = new Schema({
  ponumber: { type: String, required: true },
  createdDate: {type: Date, required: true },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  
  createdDate: {type: Date, required: false },
  modifiedDate: {type: Date, required: false },
});

module.exports = mongoose.model('clientPurchaseOrder', clientPOScehma);
