const express = require("express");
const router = express.Router();
const Tutorial = require("../app/controllers/tutorialController");
const { handle } = require("../app/middleware/auth");

// Create an instance of the class
const tutorialInstance = new Tutorial();

// Define routes
router.get("/get/:key?", handle, tutorialInstance.get);
router.post("/create", handle, tutorialInstance.create);
router.patch("/update/:key", handle, tutorialInstance.update);
router.delete("/delete/:key", handle, tutorialInstance.delete);

module.exports = router;
