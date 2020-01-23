// import packages
const mongoose = require("mongoose");

// import resources

// create and export model
module.exports = mongoose.model("Product", {
  title: String,
  description: String,
  price: Number,
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category"
  }
});
