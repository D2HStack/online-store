// imports packages
const express = require("express");
const router = express.Router();

// import middleware

// import utility functions
const isEmpty = require("../utility/isEmpty");

// import resources

// declare global variables

// import models
const User = require("../models/User");

// create routes
// route: create a user
router.post("/user/create", async (req, res) => {
  try {
    // import request
    //console.log(req.fields);

    // test if request is empty or keys in keysTest are empty
    const keysTest = ["username", "email"];
    const IsEmptyFields = isEmpty(req.fields, keysTest);
    //console.log(IsEmptyFields);
    if (IsEmptyFields.empty || IsEmptyFields.keys.length > 0) {
      res.status(400).json({
        message: "Please fill in the empty fields."
      });
    }

    // check if user with username already exists
    const username = req.fields.username;
    const email = req.fields.email;
    //console.log(username);
    const usernameUser = await User.findOne({ username });
    const emailUser = await User.findOne({ email });
    //console.log(user);
    if (!usernameUser && !emailUser) {
      const newUser = new User({
        username,
        email
      });
      await newUser.save();
      //console.log(newUser);
      res.status(200).json({
        message: `User with username '${username}' and email '${email}' has been successfully created.`
      });
    } else {
      res.status(400).json({ message: `Username or email already taken.` });
    }
  } catch (error) {
    console.log("error.message", error.message);
    res.json(error.message);
  }
});

// route: read user with _id
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
