const express = require("express");
const router = express.Router();
const PersonalityType = require("../app/controllers/personalityTypeController");
const { handle } = require("../app/middleware/auth");

// Create an instance of the class
const PersonalityTypeInstance = new PersonalityType();

// Define routes
router.get("/get/:key?", handle, PersonalityTypeInstance.get);
router.post("/create", handle, PersonalityTypeInstance.create);
router.patch("/update/:key", handle, PersonalityTypeInstance.update);
router.delete("/delete/:key", handle, PersonalityTypeInstance.delete);

module.exports = router;
