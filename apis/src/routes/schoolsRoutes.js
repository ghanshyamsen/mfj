const express = require("express");
const router = express.Router();
const Schools = require("../app/controllers/schoolsController");
const { handle } = require("../app/middleware/auth");

// Create an instance of the class
const schoolInstance = new Schools();

// Define routes
router.get("/get/:key?", handle, schoolInstance.get);
router.post("/create", handle, schoolInstance.create);
router.patch("/update/:key", handle, schoolInstance.update);
router.delete("/delete/:key", handle, schoolInstance.delete);

module.exports = router;
