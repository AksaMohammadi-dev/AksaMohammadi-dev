const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const vendorPaymentMgmntScehma = new Schema({
  id: { type: mongoose.SchemaTypes.ObjectId },
  ponumber: { type: String, required: true },
  invoicenumber: { type: String, required: true },
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor", required: false },
  amount: { type: String, required: true },
  modeofpayment: { type: String, required: true },
  paymentslipref: { type: String, required: true },
  paymentlocation: { type: String, required: true },

  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
  createdDate: {type: Date, required: false },
  modifiedDate: {type: Date, required: false },
});

module.exports = mongoose.model('VendorPaymentManagement', vendorPaymentMgmntScehma);
