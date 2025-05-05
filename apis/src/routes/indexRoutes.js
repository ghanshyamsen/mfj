const express = require("express");
const router = express.Router();
const Index = require("../app/controllers/indexController");
const { handle } = require("../app/middleware/auth");

// Create an instance of the class
const indexInstance = new Index();

// Define routes
router.get("/dashboard", handle, indexInstance.dashboard);

module.exports = router;
