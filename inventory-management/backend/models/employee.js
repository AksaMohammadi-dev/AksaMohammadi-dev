const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator')

const employeeScehma = new Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, required: true },
  isEmployee: { type: Boolean, required: true },
  isActive: { type: Boolean, required: true },
});

employeeScehma.plugin(uniqueValidator);

module.exports = mongoose.model('Employee', employeeScehma);