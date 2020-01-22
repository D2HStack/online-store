// import packages
const mongoose = require("mongoose");

// import resources

// create and export model
module.exports = mongoose.model("Category", {
  title: String,
  description: String,
  price: Number,
  departmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department"
  }
});
