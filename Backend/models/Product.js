const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: String,
  imageUrl: String,
  description: String,
  price: Number,
});

module.exports = mongoose.model('Product', ProductSchema);
