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

// route: list all categories with count
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
    // test if category exists
    const _id = req.query._id;
    const categoryToUpdate = await Category.findById(_id);
    // console.log(categoryToUpdate);
    if (!categoryToUpdate) {
      res.status(400).json({ message: `There is no category with id ${_id}.` });
    }
    // assign values to local variables. if no key or empty key by default return key value of original item

    let title = req.fields.title;
    if (!title) {
      title = categoryToUpdate.title;
    }
    // test if title exists in the request and is not already taken by another
    // console.log(await Category.findOne({ _id: { $ne: _id }, title }));
    const titleCategory = await Category.findOne({
      _id: { $ne: _id },
      title
    });
    // console.log("titleCategory", titleCategory);
    const titleFlag = Boolean(titleCategory);
    // console.log(titleFlag);
    if (titleFlag) {
      res.status(400).json({
        message: `The title '${title}' is already taken by another category`
      });
    } else {
      categoryToUpdate.title = title;
    }

    // assign description to category to be updated if no description key in the query
    let description = req.fields.description;
    if (!description) {
      description = categoryToUpdate.description;
    }
    categoryToUpdate.description = description;

    // if department is null in the request assign existing department
    let departmentId = req.fields.departmentId;
    if (!departmentId) {
      departmentId = categoryToUpdate.departmentId;
    } else {
      // department does not exist => error
      const newDepartment = await Department.findById(departmentId);
      if (!newDepartment) {
        res
          .status(400)
          .json({ message: `There is no department with id ${departmentId}` });
      }
    }
    categoryToUpdate.departmentId = departmentId;

    await categoryToUpdate.save();
    res.status(200).json({
      message: `The Category with id ${_id} has been successfully updated.`
    });
  } catch (error) {
    console.log("error.message", error.message);
    res.json(error.message);
  }
});

// export
module.exports = router;
