const express = require("express");
const router = express.Router();
const Static = require("../app/controllers/staticController");
const { handle } = require("../app/middleware/auth");

// Create an instance of the class
const staticInstance = new Static();

// Define routes
router.get("/get-email/:key?", handle, staticInstance.getemails);
router.patch("/update-email/:key", handle, staticInstance.updateemail);

module.exports = router;
