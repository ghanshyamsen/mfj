const express = require("express");
const router = express.Router();
const Academic = require("../app/controllers/academicController");
const { handle } = require("../app/middleware/auth");

// Create an instance of the class
const academicInstance = new Academic();

// Define routes
router.get("/get/:key?", handle, academicInstance.get);
router.post("/create", handle, academicInstance.create);
router.patch("/update/:key", handle, academicInstance.update);
router.delete("/delete/:key", handle, academicInstance.delete);

module.exports = router;
