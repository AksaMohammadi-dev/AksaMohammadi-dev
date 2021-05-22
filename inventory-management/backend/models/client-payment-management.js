const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const clientPaymentMgmntScehma = new Schema({
  id: { type: mongoose.SchemaTypes.ObjectId },
  ponumber: { type: String, required: true },
  invoicenumber: { type: String, required: true },
  client: { type: mongoose.Schema.Types.ObjectId, ref: "Client", required: false },
  totalAmount: { type: String, required: true },
  amount: { type: String, required: true },
  bal: { type: String, required: true },
  modeofpayment: { type: String, required: true },
  paymentslipref: { type: String, required: true },
  paymentlocation: { type: String, required: true },
  paymentDate : {type: Date, required: false },
  remark: { type: String, required: true },

  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
  createdDate: {type: Date, required: false },
  modifiedDate: {type: Date, required: false },
});

module.exports = mongoose.model('clientPaymentManagement', clientPaymentMgmntScehma);
