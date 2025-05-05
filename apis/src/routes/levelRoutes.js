const express = require("express");
const router = express.Router();

const Level = require("../app/controllers/levelsController");
const { handle } = require("../app/middleware/auth");

// Create an instance of the class
const LevelInstance = new Level();

/* Rank */
router.get("/get/:key?", handle, LevelInstance.get);
router.post("/create", handle, LevelInstance.create);
router.patch("/update/:key", handle, LevelInstance.update);
router.delete("/delete/:key", handle, LevelInstance.delete);

module.exports = router;
