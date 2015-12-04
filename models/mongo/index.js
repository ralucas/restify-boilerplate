var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Test schema and model
var placeholderSchema = new Schema({
  name: String,
  qty: Number 
});

var Placeholder = mongoose.model('Placeholder', placeholderSchema);

// add all new models to this object
var Models = {
  Placeholder: Placeholder 
};

module.exports = Models;
