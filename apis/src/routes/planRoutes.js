const express = require("express");
const router = express.Router();

const Plan = require("../app/controllers/plansController");
const { handle } = require("../app/middleware/auth");

// Create an instance of the class
const PlanInstance = new Plan();

/* Rank */
router.get("/get/:key?", handle, PlanInstance.get);
router.post("/create", handle, PlanInstance.create);
router.patch("/update/:key", handle, PlanInstance.update);
router.delete("/delete/:key", handle, PlanInstance.delete);

module.exports = router;
