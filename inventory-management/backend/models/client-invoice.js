const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator')

const clientInvoiceScehma = new Schema({
  id: { type: mongoose.SchemaTypes.ObjectId },
  invoiceno: { type: String, required: true },
  totalamount: { type: String, required: true },
  clientPOId: { type:String, required: true },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
  createdDate: {type: Date, required: false },
  modifiedDate: {type: Date, required: false },
});


module.exports = mongoose.model('ClientInvoice', clientInvoiceScehma);