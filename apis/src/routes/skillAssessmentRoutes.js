const express = require("express");
const router = express.Router();
const SkillsAssessment = require("../app/controllers/skillsAssessmentController");
const { handle } = require("../app/middleware/auth");

// Create an instance of the class
const objectInstance = new SkillsAssessment();

// Define routes
router.get("/get/:key?", handle, objectInstance.get);
router.post("/create", handle, objectInstance.create);
router.patch("/manage/:key", handle, objectInstance.update);

module.exports = router;
