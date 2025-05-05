const express = require("express");
const router = express.Router();
const Package = require("../app/controllers/packagesController");

const { handle } = require("../app/middleware/auth");

// Create an instance of the class
const PackageInstance = new Package();


// Define routes
router.get("/get/:key?", handle, PackageInstance.get);
router.post("/create", handle, (req, res, next) => {
    uploadFile(req, res, 'uploads/package/', ['jpeg', 'jpg', 'png' , 'svg'], 'package_image', 'single').then((result) => {
        if(result.status){
            req.body.package_image = result.file.filename;
        }
        PackageInstance.create(req, res);
    }).catch((err) => {
        res.status(200).json({status:false, message:err.message});
    });
});
router.patch("/update/:key", handle, (req, res, next) => {
    uploadFile(req, res, 'uploads/package/', ['jpeg', 'jpg', 'png', 'svg'], 'package_image', 'single').then((result) => {
        if(result.status){
            req.body.image = result.file.filename;
        }
        PackageInstance.update(req, res);
    }).catch((err) => {
        res.status(200).json({status:false, message:err.message});
    });
});

router.delete("/delete/:key", handle, PackageInstance.delete);


module.exports = router;
