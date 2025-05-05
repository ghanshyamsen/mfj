const express = require("express");
const router = express.Router();
const EmployersAassessments = require("../app/controllers/employersAassessmentsController");
const { handle } = require("../app/middleware/auth");

// Create an instance of the class
const EmployersAassessmentsInstance = new EmployersAassessments();

// Define routes
router.get("/get/:key?", handle, EmployersAassessmentsInstance.get);
router.post("/create", handle, EmployersAassessmentsInstance.create);
router.patch("/update/:key", handle, EmployersAassessmentsInstance.update);
router.delete("/delete/:key", handle, EmployersAassessmentsInstance.delete);

module.exports = router;
