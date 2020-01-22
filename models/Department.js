// import packages
const mongoose = require("mongoose");

// import resources

// create and export model
module.exports = mongoose.model("Department", {
  title: String
});
