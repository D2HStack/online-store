// import packages
const mongoose = require("mongoose");

// import resources

// create and export model
module.exports = mongoose.model("User", {
  username: {
    type: String,
    minlength: 3,
    maxlength: 20,
    required: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    minlength: 6,
    maxlength: 254
  }
});
