const express = require("express");
const router = express.Router();
const Users = require("../app/controllers/userController");
const { handle } = require("../app/middleware/auth");

// Create an instance of the class
const userInstance = new Users();

// Define routes
router.get("/get/:key?/:type?", handle, userInstance.get);
router.patch("/update/:key", handle, userInstance.update);
router.patch("/update-status", handle, userInstance.updatestatus);
router.get("/delete/:key", handle, userInstance.delete);

module.exports = router;
