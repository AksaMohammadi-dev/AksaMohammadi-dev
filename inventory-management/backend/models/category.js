const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categoryScehma = new Schema({
  id: { type: mongoose.SchemaTypes.ObjectId },
  name: { type: String, required: true },
  parentCategory: { type: String, required: false },
  createdDate: {type: Date, required: false },
  modifiedDate: {type: Date, required: false },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
});

module.exports = mongoose.model('Categories', categoryScehma);
