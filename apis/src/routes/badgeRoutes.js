const express = require("express");
const router = express.Router();
const { handle } = require("../app/middleware/auth");
const Badges = require("../app/controllers/badgeController");

const badgeInstance = new Badges();
router.get("/get/:key?", handle, badgeInstance.get);
router.post("/create", handle, (req, res, next) => {
  uploadFile(
    req,
    res,
    "uploads/badge/",
    ["jpeg", "jpg", "png", "svg"],
    "badge_image",
    "single"
  )
    .then((result) => {
      //console.log("result", result);
      if (result.status) {
        req.body.badge_image = result.file.filename;
      }
      badgeInstance.create(req, res);
    })
    .catch((err) => {
      res.status(200).json({ status: false, message: err.message });
    });
});
router.patch("/update/:key?", handle, (req, res, next) => {
  uploadFile(
    req,
    res,
    "uploads/badge/",
    ["jpeg", "jpg", "png", "svg"],
    "badge_image",
    "single"
  )
    .then((result) => {
      if (result.status) {
        req.body.badge_image = result.file.filename;
      }
      //console.log(result);
      badgeInstance.update(req, res);
    })
    .catch((err) => {
      res.status(200).json({ status: false, message: err.message });
    });
});
router.delete("/delete/:key?", handle, badgeInstance.delete);

module.exports = router;
