const express = require("express");
const router = express.Router();

const Rank = require("../app/controllers/ranksController");
const { handle } = require("../app/middleware/auth");

// Create an instance of the class
const RankInstance = new Rank();

/* Rank */
router.get("/get/:key?", handle, RankInstance.get);
router.post("/create", handle, (req, res, next) => {
    uploadFile(req, res, 'uploads/rank/', ['jpeg', 'jpg', 'png' , 'svg'], 'image', 'single').then((result) => {
        if(result.status){
            req.body.image = result.file.filename;
        }
        RankInstance.create(req, res);
    }).catch((err) => {
        res.status(200).json({status:false, message:err.message});
    });
});
router.patch("/update/:key", handle, (req, res, next) => {
    uploadFile(req, res, 'uploads/rank/', ['jpeg', 'jpg', 'png', 'svg'], 'image', 'single').then((result) => {
        if(result.status){
            req.body.image = result.file.filename;
        }
        RankInstance.update(req, res);
    }).catch((err) => {
        res.status(200).json({status:false, message:err.message});
    });
});
router.delete("/delete/:key", handle, RankInstance.delete);


module.exports = router;
