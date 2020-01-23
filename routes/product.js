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
const Product = require("../models/Product");

// create routes
// route: create a product
router.post("/product/create", async (req, res) => {
  try {
    // import request
    //console.log(req.fields);

    //test if request is empty or keys in keysTest are empty
    const keysTest = ["title", "description", "price", "categoryId"];
    const IsEmptyFields = isEmpty(req.fields, keysTest);
    //console.log(IsEmptyFields);
    if (IsEmptyFields.empty || IsEmptyFields.keys.length > 0) {
      res.status(400).json({
        message: "Please fill in the empty fields."
      });
    }

    // check if product with title already exists
    const title = req.fields.title;
    //console.log(title);
    const product = await Product.findOne({ title });
    //console.log(product);
    if (!product) {
      const categoryId = req.fields.categoryId;
      const relatedCategory = await Category.findById(categoryId);
      if (relatedCategory) {
        const price = req.fields.price;
        const description = req.fields.description;
        const newProduct = new Product({
          title,
          description,
          price,
          categoryId
        });
        await newProduct.save();
        console.log(newProduct);
        res.status(200).json({
          message: `Product with title '${title}' has been successfully created in category ${relatedCategory.title}.`
        });
      } else {
        res.status(400).json({
          message: `There is no category with id '${categoryId}'.`
        });
      }
    } else {
      res
        .status(400)
        .json({ message: `Product with title '${title} already exists.` });
    }
  } catch (error) {
    console.log("error.message", error.message);
    res.json(error.message);
  }
});

// route: list all products with count
router.get("/product", async (req, res) => {
  try {
    const products = await Product.find().populate("categoryId");
    // console.log(products);

    res.status(200).json({
      message: "Please find the list of products and with number of products.",
      data: { count: products.length, products }
    });
  } catch (error) {
    console.log("error.message", error.message);
    res.json(error.message);
  }
});

// route: update a product
router.post("/product/update", async (req, res) => {
  try {
    // test if product exists
    const _id = req.query._id;
    const productToUpdate = await Product.findById(_id);
    // console.log(productToUpdate);
    if (!productToUpdate) {
      res.status(400).json({ message: `There is no product with id ${_id}.` });
    }
    // assign values to local variables. if no key or empty key by default return key value of original item

    let title = req.fields.title;
    if (!title) {
      title = productToUpdate.title;
    }
    // test if title exists in the request and is not already taken by another
    // console.log(await product.findOne({ _id: { $ne: _id }, title }));
    const titleProduct = await Product.findOne({
      _id: { $ne: _id },
      title
    });
    // console.log("titleProduct", titleProduct);
    const titleFlag = Boolean(titleProduct);
    // console.log(titleFlag);
    if (titleFlag) {
      res.status(400).json({
        message: `The title '${title}' is already taken by another product.`
      });
    } else {
      productToUpdate.title = title;
    }

    // if category is null in the request assign existing category
    let categoryId = req.fields.categoryId;
    if (!categoryId) {
      categoryId = productToUpdate.categoryId;
    } else {
      // category does not exist => error
      const newCategory = await Category.findById(categoryId);
      if (!newCategory) {
        res
          .status(400)
          .json({ message: `There is no category with id ${categoryId}` });
      }
    }
    productToUpdate.categoryId = categoryId;

    // assign description to product to be updated if no description key in the query
    let description = req.fields.description;
    if (!description) {
      description = productToUpdate.description;
    }
    productToUpdate.description = description;

    // assign price to product to be updated if no price key in the query
    let price = req.fields.price;
    if (!price) {
      price = productToUpdate.price;
    }
    productToUpdate.price = price;

    await productToUpdate.save();
    res.status(200).json({
      message: `The product with id ${_id} has been successfully updated.`
    });
  } catch (error) {
    console.log("error.message", error.message);
    res.json(error.message);
  }
});

// route: remove a product
router.post("/product/delete", async (req, res) => {
  try {
    // test if product exists
    const _id = req.query._id;
    const productToDelete = await Product.findById(_id);
    // console.log(productToUpdate);
    if (!productToDelete) {
      res.status(400).json({ message: `There is no product with id ${_id}.` });
    } else {
      productToDelete.remove();
      res.status(200).json({
        message: `Product with id ${_id} has been successfully deleted.`
      });
    }
  } catch (error) {
    console.log("error.message", error.message);
    res.json(error.message);
  }
});

// export
module.exports = router;
