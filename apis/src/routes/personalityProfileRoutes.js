const express = require("express");
const router = express.Router();
const PersonalityProfile = require("../app/controllers/personalityProfileController");
const { handle } = require("../app/middleware/auth");

// Create an instance of the class
const PersonalityProfileInstance = new PersonalityProfile();

// Define routes
router.get("/get/:key?", handle, PersonalityProfileInstance.get);
router.post("/create", handle, PersonalityProfileInstance.create);
router.patch("/update/:key", handle, PersonalityProfileInstance.update);
router.delete("/delete/:key", handle, PersonalityProfileInstance.delete);

module.exports = router;
