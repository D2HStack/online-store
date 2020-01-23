// import packages
const express = require("express");
const expressFormidable = require("express-formidable");
const mongoose = require("mongoose");

// import middleware

// import utility functions

// import resources

// declare global variables

// creates app and use express and express-formidable
const app = express();
app.use(expressFormidable());

//use mongoose to connect to the database
const databaseURL = "mongodb://localhost/online-store";
mongoose.connect(databaseURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
});

// import models

// import routes
// route department
const department = require("./routes/department");
app.use(department);
//route category
const category = require("./routes/category");
app.use(category);
// route product
const product = require("./routes/product");
app.use(product);

// returns message for unidentified routes
app.all("*", (req, res) => {
  res.status(404).json({
    error: {
      message: "404 Not Found"
    }
  });
});

// listen to local host port 3000
const port = 3000;
app.listen(port, () => console.log("Server has started"));
