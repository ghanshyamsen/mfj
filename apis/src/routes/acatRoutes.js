const express = require("express");
const router = express.Router();
const ActivitieCategory = require("../app/controllers/activitiecategoryController");
const { handle } = require("../app/middleware/auth");

// Create an instance of the class
const acatInstance = new ActivitieCategory();

// Define routes
router.get("/get/:key?", handle, acatInstance.get);
router.post("/create", handle, acatInstance.create);
router.patch("/update/:key", handle, acatInstance.update);
router.delete("/delete/:key", handle, acatInstance.delete);

module.exports = router;
