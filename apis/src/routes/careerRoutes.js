const express = require("express");
const router = express.Router();
const Career = require("../app/controllers/careersController");
const { handle } = require("../app/middleware/auth");

// Create an instance of the class
const CareerInstance = new Career();

// Define routes
router.get("/get/:key?", handle, CareerInstance.get);
router.post("/create", handle, CareerInstance.create);
router.patch("/update/:key", handle, CareerInstance.update);
router.delete("/delete/:key", handle, CareerInstance.delete);

module.exports = router;
