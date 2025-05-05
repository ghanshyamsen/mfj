const express = require("express");
const router = express.Router();
const TutorialCategory = require("../app/controllers/tutorialcategoryController");
const { handle } = require("../app/middleware/auth");

// Create an instance of the class
const tcatInstance = new TutorialCategory();

// Define routes
router.get("/get/:key?", handle, tcatInstance.get);
router.post("/create", handle, tcatInstance.create);
router.patch("/update/:key", handle, tcatInstance.update);
router.delete("/delete/:key", handle, tcatInstance.delete);

module.exports = router;
