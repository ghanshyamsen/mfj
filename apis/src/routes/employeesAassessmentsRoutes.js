const express = require("express");
const router = express.Router();
const EmployeesAassessments = require("../app/controllers/employeesAassessmentsController");
const { handle } = require("../app/middleware/auth");

// Create an instance of the class
const EmployeesAassessmentsInstance = new EmployeesAassessments();

// Define routes
router.get("/get/:key?", handle, EmployeesAassessmentsInstance.get);
router.post("/create", handle, EmployeesAassessmentsInstance.create);
router.patch("/update/:key", handle, EmployeesAassessmentsInstance.update);
router.delete("/delete/:key", handle, EmployeesAassessmentsInstance.delete);

module.exports = router;
