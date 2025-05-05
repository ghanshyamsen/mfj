const express = require("express");
const router = express.Router();
const Coursework = require("../app/controllers/courseworkController");
const { handle } = require("../app/middleware/auth");

// Create an instance of the class
const courseworkInstance = new Coursework();

// Define routes
router.get("/get/:key?", handle, courseworkInstance.get);
router.post("/create", handle, courseworkInstance.create);
router.patch("/update/:key", handle, courseworkInstance.update);
router.delete("/delete/:key", handle, courseworkInstance.delete);

module.exports = router;
