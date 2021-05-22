const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const clientPODetailSchema = new Schema({
  clientPOId: { type: mongoose.SchemaTypes.ObjectId },
  // productId : { type: mongoose.SchemaTypes.ObjectId,ref: "Product", required: true },
  productId : { type: String, required: true },
  quantity: { type: String, required: true },
  scheduledDate: { type: Date, required: true },
  status: { type: String, required: true },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  serialnoDetials:[{
  }],
  selectedSerialnoDetails:[{

  }],
  amount: { type: String, default:''},
  isInvoiced: { type: Boolean, default:false},
  invoiceNo: { type: String, default:''},
  createdDate: {type: Date, required: false },
  modifiedDate: {type: Date, required: false },
});

module.exports = mongoose.model('ClientPurchaseOrderDetial', clientPODetailSchema);
