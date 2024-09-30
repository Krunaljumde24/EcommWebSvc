const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  title: String,
  price: String,
  rating: Number,
  reviewCount: Number,
  discount: Number,
  category: String,
  description: String,
  features: [String],
  images: [String],
});

const Product = mongoose.model("Product", ProductSchema);
module.exports = Product;
