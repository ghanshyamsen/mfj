const express = require("express");
const router = express.Router();
const Teenager = require("../app/controllers/teenagerController");


// Create an instance of the class
const teenagerInstance = new Teenager();

// Define routes
router.get("/get/:key?", teenagerInstance.get);
router.delete("/delete/:key", teenagerInstance.delete);


module.exports = router;
