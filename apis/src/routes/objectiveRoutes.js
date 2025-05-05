const express = require("express");
const router = express.Router();
const Objectivce = require("../app/controllers/objectiveController");
const { handle } = require("../app/middleware/auth");

// Create an instance of the class
const objectInstance = new Objectivce();

// Define routes
router.get("/get/:key?", handle, objectInstance.get);
router.patch("/update/:key", handle, objectInstance.update);

module.exports = router;
