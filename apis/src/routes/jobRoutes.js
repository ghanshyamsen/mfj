const express = require("express");
const router = express.Router();
const Job = require("../app/controllers/jobController");
const JobSuggestion = require("../app/controllers/jobSuggestionsController");
const { handle } = require("../app/middleware/auth");

// Create an instance of the class
const jobInstance = new Job();
const JobSuggestionInstance = new JobSuggestion();

// Define routes
router.get("/get/:key?", handle, jobInstance.get);
router.post("/create", handle, (req, res, next) => {
    uploadFile(req, res, 'uploads/job/', ['jpeg', 'jpg', 'png' , 'svg'], 'logo', 'single').then((result) => {
        if(result.status){
            req.body.logo = result.file.filename;
        }

        jobInstance.create(req, res);
    }).catch((err) => {
        res.status(200).json({status:false, message:err.message});
    });
});
router.patch("/update/:key", handle, (req, res, next) => {
    uploadFile(req, res, 'uploads/job/', ['jpeg', 'jpg', 'png', 'svg'], 'logo', 'single').then((result) => {
        if(result.status){
            req.body.logo = result.file.filename;
        }
        jobInstance.update(req, res);
    }).catch((err) => {
        res.status(200).json({status:false, message:err.message});
    });
});
router.patch("/update-status", handle, jobInstance.updatestatus);
router.delete("/delete/:key", handle, jobInstance.delete);

/** Suggestions */
router.get("/suggestion/get/:key?", handle, JobSuggestionInstance.get);
router.post("/suggestion/create", handle, JobSuggestionInstance.create);
router.patch("/suggestion/update/:key?", handle, JobSuggestionInstance.update);
router.delete("/suggestion/delete/:key", handle, JobSuggestionInstance.delete);

/** Categories */
router.get("/category/get/:key?", handle, JobSuggestionInstance.getcategory);
router.post("/category/create", handle, JobSuggestionInstance.createcategory);
router.patch("/category/update/:key?", handle, JobSuggestionInstance.updatecategory);
router.delete("/category/delete/:key", handle, JobSuggestionInstance.deletecategory);


module.exports = router;
