const express = require("express");
const router = express.Router();
const HobbiesCategory = require("../app/controllers/hobbiescategoryController");
const { handle } = require("../app/middleware/auth");

// Create an instance of the class
const hcatInstance = new HobbiesCategory();

// Define routes
router.get("/get/:key?", handle, hcatInstance.get);
router.post("/create", handle, hcatInstance.create);
router.patch("/update/:key", handle, hcatInstance.update);
router.delete("/delete/:key", handle, hcatInstance.delete);

module.exports = router;
