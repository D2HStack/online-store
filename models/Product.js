// import packages
const mongoose = require("mongoose");

// import resources

// create and export model
module.exports = mongoose.model("Product", {
  title: String,
  description: String,
  price: Number,
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review"
    }
  ],
  averageRating: { type: Number, min: 0, max: 5 },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category"
  }
});
