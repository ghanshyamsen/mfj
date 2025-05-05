const express = require("express");
const router = express.Router();
const FaqCategory = require("../app/controllers/faqcategoryController");
const { handle } = require("../app/middleware/auth");

// Create an instance of the class
const fcatInstance = new FaqCategory();

// Define routes
router.get("/get/:key?", handle, fcatInstance.get);
router.post("/create", handle, fcatInstance.create);
router.patch("/update/:key", handle, fcatInstance.update);
router.delete("/delete/:key", handle, fcatInstance.delete);

module.exports = router;
