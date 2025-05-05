const express = require("express");
const router = express.Router();
const StarterJob = require("../app/controllers/starterjobsController");
const { handle } = require("../app/middleware/auth");

// Create an instance of the class
const StarterJobInstance = new StarterJob();

// Define routes
router.get("/get/:key?", handle, StarterJobInstance.get);
router.post("/create", handle, StarterJobInstance.create);
router.patch("/update/:key", handle, StarterJobInstance.update);
router.delete("/delete/:key", handle, StarterJobInstance.delete);

module.exports = router;
