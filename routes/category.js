// imports packages
const express = require("express");
const router = express.Router();

// import middleware

// import utility functions
const isEmpty = require("../utility/isEmpty");

// import resources

// declare global variables

// import models
const Category = require("../models/Category");
const Department = require("../models/Department");

// create routes
// route: create a category
router.post("/category/create", async (req, res) => {
  try {
    // import request
    //console.log(req.fields);

    //test if request is empty or keys in keysTest are empty
    const keysTest = ["title", "description", "departmentId"];
    const IsEmptyFields = isEmpty(req.fields, keysTest);
    //console.log(IsEmptyFields);
    if (IsEmptyFields.empty || IsEmptyFields.keys.length > 0) {
      res.status(400).json({
        message: "Please fill in the empty fields."
      });
    }

    // check if category with title already exists
    const title = req.fields.title;
    //console.log(title);
    const category = await Category.findOne({ title });
    //console.log(category);
    if (!category) {
      const departmentId = req.fields.departmentId;
      const relatedDepartment = await Department.findById(departmentId);
      if (relatedDepartment) {
        const description = req.fields.description;
        const newCategory = new Category({
          title,
          description,
          departmentId
        });
        await newCategory.save();
        console.log(newCategory);
        res.status(200).json({
          message: `Category with title '${title}' has been successfully created in department ${relatedDepartment.title}.`
        });
      } else {
        res.status(400).json({
          message: `There is no departement with id '${departmentId}'.`
        });
      }
    } else {
      res
        .status(400)
        .json({ message: `Category with title '${title} already exists.` });
    }
  } catch (error) {
    console.log("error.message", error.message);
    res.json(error.message);
  }
});

// route: list all categorys with count
router.get("/category", async (req, res) => {
  try {
    const categories = await Category.find().populate("departmentId");
    // console.log(categories);

    res.status(200).json({
      message:
        "Please find the list of categories and with number of categories.",
      data: { count: categories.length, categories }
    });
  } catch (error) {
    console.log("error.message", error.message);
    res.json(error.message);
  }
});

// route: update a category
router.post("/category/update", async (req, res) => {
  try {
    // test if request is empty or keys in keysTest are empty
    const keysTest = ["title"];
    const IsEmptyFields = isEmpty(req.fields, keysTest);
    //console.log(IsEmptyFields);
    if (IsEmptyFields.empty || IsEmptyFields.keys.length > 0) {
      res.status(400).json({
        message: "Please fill in the empty fields."
      });
    }

    // check if category with title already exists
    const title = req.fields.title;
    // console.log("title", title);
    const category = await category.findOne({ title });
    // console.log("category", category);
    if (!category) {
      const categoryToUpdate = await category.findById(req.query._id);
      // console.log(categoryToUpdate);
      categoryToUpdate.title = title;
      await categoryToUpdate.save();

      res.status(200).json({
        message: `category has been successfully updated with title '${title}'.`
      });
    } else {
      res
        .status(400)
        .json({ message: `category with title '${title}' already exists.` });
    }
  } catch (error) {
    console.log("error.message", error.message);
    res.json(error.message);
  }
});

// export
module.exports = router;
