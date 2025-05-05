const express = require("express");
const router = express.Router();
const Profile = require("../app/controllers/profileController");
const { handle } = require("../app/middleware/auth");

// Create an instance of the class
const profileInstance = new Profile();

// Define routes
router.get("/get/:key", handle, profileInstance.get);
router.patch("/update/:key", handle, profileInstance.update);
router.patch("/reset-password/:key", handle, profileInstance.resetpassword);

module.exports = router;
