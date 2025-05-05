const express = require("express");
const router = express.Router();
const Faq = require("../app/controllers/faqController");
const { handle } = require("../app/middleware/auth");

// Create an instance of the class
const faqInstance = new Faq();

// Define routes
router.get("/get/:key?", handle, faqInstance.get);
router.post("/create", handle, faqInstance.create);
router.patch("/update/:key", handle, faqInstance.update);
router.delete("/delete/:key", handle, faqInstance.delete);

module.exports = router;
