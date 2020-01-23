// imports packages
const express = require("express");
const router = express.Router();

// import middleware

// import utility functions
const isEmpty = require("../utility/isEmpty");

// import resources

// declare global variables

// import models
const Department = require("../models/Department");
const Category = require("../models/Category");
const Product = require("../models/Product");

// create routes
// route: create a department
router.post("/department/create", async (req, res) => {
  try {
    // import request
    //console.log(req.fields);

    // test if request is empty or keys in keysTest are empty
    const keysTest = ["title"];
    const IsEmptyFields = isEmpty(req.fields, keysTest);
    //console.log(IsEmptyFields);
    if (IsEmptyFields.empty || IsEmptyFields.keys.length > 0) {
      res.status(400).json({
        message: "Please fill in the empty fields."
      });
    }

    // check if department with title already exists
    const title = req.fields.title;
    console.log(title);
    const department = await Department.findOne({ title });
    console.log(department);
    if (!department) {
      const newDepartment = new Department({
        title
      });
      await newDepartment.save();
      console.log(newDepartment);
      res.status(200).json({
        message: `Department with title '${title}' has been successfully created.`
      });
    } else {
      res
        .status(400)
        .json({ message: `Department with title '${title} already exists.` });
    }
  } catch (error) {
    console.log("error.message", error.message);
    res.json(error.message);
  }
});

// route: list all departments with count
router.get("/department", async (req, res) => {
  try {
    const departments = await Department.find();
    // console.log(departments);

    res.status(200).json({
      message:
        "Please find the list of departments and with number of departments.",
      data: { count: departments.length, departments }
    });
  } catch (error) {
    console.log("error.message", error.message);
    res.json(error.message);
  }
});

// route: update a department
router.post("/department/update", async (req, res) => {
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

    // check if department with title already exists
    const title = req.fields.title;
    // console.log("title", title);
    const department = await Department.findOne({ title });
    // console.log("department", department);
    if (!department) {
      const departmentToUpdate = await Department.findById(req.query._id);
      // console.log(departmentToUpdate);
      departmentToUpdate.title = title;
      await departmentToUpdate.save();

      res.status(200).json({
        message: `Department has been successfully updated with title '${title}'.`
      });
    } else {
      res
        .status(400)
        .json({ message: `Department with title '${title}' already exists.` });
    }
  } catch (error) {
    console.log("error.message", error.message);
    res.json(error.message);
  }
});

// route: remove a department
router.post("/department/delete", async (req, res) => {
  try {
    // test if department exists
    const _id = req.query._id;
    // console.log(_id);
    const departmentToDelete = await Department.findById(_id);
    //console.log(departmentToDelete);
    if (!departmentToDelete) {
      res
        .status(400)
        .json({ message: `There is no department with id ${_id}.` });
    } else {
      const categoriesToDelete = await Category.find({
        departmentId: departmentToDelete
      });
      // console.log("categoriesToDelete", categoriesToDelete);
      categoriesToDelete.forEach(async category => {
        const productsToDelete = await Product.find({ categoryId: category });
        productsToDelete.forEach(async product => {
          await product.remove();
        });
        await category.remove();
      });
      departmentToDelete.remove();
      res.status(200).json({
        message: `department with id ${_id} and all its associated products have been successfully deleted.`
      });
    }
  } catch (error) {
    console.log("error.message", error.message);
    res.json(error.message);
  }
});

// export
module.exports = router;
