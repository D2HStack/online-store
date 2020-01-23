// imports packages
const express = require("express");
const router = express.Router();

// import middleware

// import utility functions
const isEmpty = require("../utility/isEmpty");

// import resources

// declare global variables

// import models
const Review = require("../models/Review");
const Product = require("../models/Product");
const User = require("../models/User");

// create routes
// route: create a review
router.post("/review/create", async (req, res) => {
  try {
    // import request
    //console.log(req.fields);

    // test if request is empty or keys in keysTest are empty
    const keysTest = ["product", "rating", "comment", "user"];
    const IsEmptyFields = isEmpty(req.fields, keysTest);
    //console.log(IsEmptyFields);
    if (IsEmptyFields.empty || IsEmptyFields.keys.length > 0) {
      res.status(400).json({
        message: "Please fill in the empty fields."
      });
    }

    // check if product and user exists
    const productId = req.fields.product;
    const userId = req.fields.user;
    const product = await Product.findById(productId);
    const user = await User.findById(userId);
    const rating = req.fields.rating;

    if (product && user && rating) {
      const comment = req.fields.comment;
      const newReview = new Review({
        product,
        rating,
        comment,
        user
      });
      await newReview.save();
      //console.log(newReview);
      const formerNbReviews = product.reviews.length;
      product.reviews.push(newReview);
      product.averageRating =
        (product.averageRating * formerNbReviews + rating) /
        (formerNbReviews + 1);
      await product.save();
      res.status(200).json({
        message: `Your review has been successfully posted.`
      });
    } else {
      res.status(400).json({
        message: `Please enter valid data for product, user nd rating.`
      });
    }
  } catch (error) {
    console.log("error.message", error.message);
    res.json(error.message);
  }
});

// route: read review with _id
router.get("/user", async (req, res) => {
  try {
    const user = await User.findById(req.query._id);
    // console.log(user);

    res.status(200).json({
      message: "User with id ${req.query._id}",
      data: user
    });
  } catch (error) {
    console.log("error.message", error.message);
    res.json(error.message);
  }
});

// route: update a user
router.post("/user/update", async (req, res) => {
  try {
    // assign variables of req.fields
    const _id = req.query._id;
    // console.log("_id", _id);
    const userToUpdate = await User.findById(_id);
    if (!userToUpdate) {
      res
        .status(400)
        .json({ message: `User with id '${_id}' does not exist.` });
    }

    const username = req.fields.username;
    // console.log("username", username);
    const email = req.fields.email;
    // console.log("email", email);
    if (!username && !email) {
      res
        .status(400)
        .json({ message: `Please enter at least one field to update` });
    } else {
      if (username) {
        userToUpdate.username = username;
      }
      if (email) {
        userToUpdate.email = email;
      }
    }
    await userToUpdate.save();
    res.status(200).json({
      message: `User with id '${_id} has been successfully updated.'.`
    });
  } catch (error) {
    console.log("error.message", error.message);
    res.json(error.message);
  }
});

// route: remove a user
router.post("/user/delete", async (req, res) => {
  try {
    // test if user exists
    const _id = req.query._id;
    // console.log(_id);
    const userToDelete = await user.findById(_id);
    //console.log(userToDelete);
    if (!userToDelete) {
      res.status(400).json({ message: `There is no user with id ${_id}.` });
    } else {
      userToDelete.remove();
      res.status(200).json({
        message: `user with id ${_id} has been successfully deleted.`
      });
    }
  } catch (error) {
    console.log("error.message", error.message);
    res.json(error.message);
  }
});

// export
module.exports = router;
