const express = require("express");



const router = express.Router();
const LMS = require("../app/controllers/lmsController");

const { handle } = require("../app/middleware/auth");

// Create an instance of the class
const LmsInstance = new LMS();

const fs = require('fs');
const path = require('path');

// Define routes
router.get("/skill/get/:key?", handle, LmsInstance.getskill);

router.post("/skill/create", handle, async (req, res, next) => {

    try {

        const  fields = [
            { name: 'thumbnail', maxCount: 1 },
            { name: 'skill_logo', maxCount: 1 },
            { name: 'skill_badge', maxCount: 1 }
        ];

        const result = await uploadFile(req, res, 'uploads/lms/skills/', ['jpeg', 'jpg', 'png', 'svg'], fields, 'fields');

        // Assign uploaded file names to req.body
        if(result?.files['thumbnail']?.[0]?.filename){
            req.body.thumbnail = result.files['thumbnail'][0].filename;
        }
        if(result?.files['skill_logo']?.[0]?.filename){
            req.body.skill_logo = result.files['skill_logo'][0].filename;
        }

        if(result?.files['skill_badge']?.[0]?.filename){
            req.body.skill_badge = result.files['skill_badge'][0].filename;
        }

        // Proceed to skill creation
        LmsInstance.createskill(req, res);

    } catch (err) {
        LmsInstance.createskill(req, res);
    }
});

router.patch("/skill/update/:key", handle, async (req, res, next) => {

    try {

        const  fields = [
            { name: 'thumbnail', maxCount: 1 },
            { name: 'skill_logo', maxCount: 1 },
            { name: 'skill_badge', maxCount: 1 }
        ];

        const result = await uploadFile(req, res, 'uploads/lms/skills/', ['jpeg', 'jpg', 'png', 'svg'], fields, 'fields');

        // Assign uploaded file names to req.body
        if(result?.files['thumbnail']?.[0]?.filename){
            req.body.thumbnail = result.files['thumbnail'][0].filename;
        }
        if(result?.files['skill_logo']?.[0]?.filename){
            req.body.skill_logo = result.files['skill_logo'][0].filename;
        }

        if(result?.files['skill_badge']?.[0]?.filename){
            req.body.skill_badge = result.files['skill_badge'][0].filename;
        }

        // Proceed with creating the skill after all uploads have completed
        LmsInstance.updateskill(req, res);

    } catch (err) {
        LmsInstance.updateskill(req, res);
    }

});

router.delete("/skill/delete/:key", handle, LmsInstance.deleteskill);


/** Learning Path */
router.get("/path/get/:key?", handle, LmsInstance.getpath);

router.post("/path/create", handle, async (req, res, next) => {

    try {

        const  fields = [
            { name: 'thumbnail', maxCount: 1 },
            { name: 'logo', maxCount: 1 },
            { name: 'badge', maxCount: 1 }
        ];

        const result = await uploadFile(req, res, 'uploads/lms/path/', ['jpeg', 'jpg', 'png', 'svg'], fields, 'fields');

        // Assign uploaded file names to req.body
        if(result?.files['thumbnail']?.[0]?.filename){
            req.body.thumbnail = result.files['thumbnail'][0].filename;
        }
        if(result?.files['logo']?.[0]?.filename){
            req.body.logo = result.files['logo'][0].filename;
        }

        if(result?.files['badge']?.[0]?.filename){
            req.body.badge = result.files['badge'][0].filename;
        }

        // Proceed to skill creation
        LmsInstance.createpath(req, res);

    } catch (err) {
        LmsInstance.createpath(req, res);
    }
});

router.patch("/path/update/:key", handle, async (req, res, next) => {

    try {

        const  fields = [
            { name: 'thumbnail', maxCount: 1 },
            { name: 'logo', maxCount: 1 },
            { name: 'badge', maxCount: 1 }
        ];

        const result = await uploadFile(req, res, 'uploads/lms/path/', ['jpeg', 'jpg', 'png', 'svg'], fields, 'fields');

        // Assign uploaded file names to req.body
        if(result?.files['thumbnail']?.[0]?.filename){
            req.body.thumbnail = result.files['thumbnail'][0].filename;
        }
        if(result?.files['logo']?.[0]?.filename){
            req.body.logo = result.files['logo'][0].filename;
        }

        if(result?.files['badge']?.[0]?.filename){
            req.body.badge = result.files['badge'][0].filename;
        }

        // Proceed with creating the skill after all uploads have completed
        LmsInstance.updatepath(req, res);

    } catch (err) {
        LmsInstance.updatepath(req, res);
    }

});

router.delete("/path/delete/:key", handle, LmsInstance.deletepath);



/** Learning Material */
router.get("/material/get/:key?", handle, LmsInstance.getmaterial);

router.post("/material/create", handle, async (req, res, next) => {

    try {

        const  fields = [
            { name: 'thumbnail', maxCount: 1 },
            { name: 'content_media', maxCount: 1 },
            { name: 'material_media', maxCount: 1 },
        ];

        const result = await uploadFile(req, res, 'uploads/lms/material/', ['jpeg', 'jpg', 'png', 'svg','zip','pdf','mp4'], fields, 'fields',250);

        // Assign uploaded file names to req.body
        if(result?.files['thumbnail']?.[0]?.filename){
            req.body.thumbnail = result.files['thumbnail'][0].filename;
        }

        if(result?.files['material_media']?.[0]?.filename){
            req.body.material_media = result.files['material_media'][0].filename;
        }

        if(result?.files['content_media']?.[0]?.filename){

            const uploadedFile = result?.files['content_media']?.[0];

            const extractFolderName = path.parse(uploadedFile.filename).name;

            const targetDir = path.join(__dirname, '../../uploads/lms/material/bundle', extractFolderName);

            const zipFilePath = path.join(__dirname, '../../uploads/lms/material', uploadedFile.filename); // Replace with your ZIP path

            req.body.content_media = uploadedFile.filename;
            req.body.targetDir = targetDir;
            req.body.zipFilePath = zipFilePath;
            req.body.content_media_path = `uploads/lms/material/bundle/${extractFolderName}`;
        }

        // Proceed to skill creation
        LmsInstance.creatematerial(req, res);

    } catch (err) {
        if(err.code === 'LIMIT_FILE_SIZE'){
            return res.status(200).json(err);
        }
        LmsInstance.creatematerial(req, res);
    }
});

router.patch("/material/update/:key", handle, async (req, res, next) => {

    try {

        const  fields = [
            { name: 'thumbnail', maxCount: 1 },
            { name: 'content_media', maxCount: 1 },
            { name: 'material_media', maxCount: 1 },
        ];

        const result = await uploadFile(req, res, 'uploads/lms/material/', ['jpeg', 'jpg', 'png', 'svg','zip','pdf','mp4'], fields, 'fields',250);

        // Assign uploaded file names to req.body
        if(result?.files['thumbnail']?.[0]?.filename){
            req.body.thumbnail = result.files['thumbnail'][0].filename;
        }

        if(result?.files['material_media']?.[0]?.filename){
            req.body.material_media = result.files['material_media'][0].filename;
        }

        if(result?.files['content_media']?.[0]?.filename){

            const uploadedFile = result?.files['content_media']?.[0];

            const extractFolderName = path.parse(uploadedFile.filename).name;

            const targetDir = path.join(__dirname, '../../uploads/lms/material/bundle', extractFolderName);

            const zipFilePath = path.join(__dirname, '../../uploads/lms/material', uploadedFile.filename); // Replace with your ZIP path

            req.body.content_media = uploadedFile.filename;
            req.body.targetDir = targetDir;
            req.body.zipFilePath = zipFilePath;
            req.body.content_media_path = extractFolderName;
        }

        // Proceed with creating the skill after all uploads have completed
        LmsInstance.updatematerial(req, res);

    } catch (err) {
        if(err.code === 'LIMIT_FILE_SIZE'){
            return res.status(200).json(err);
        }
        LmsInstance.updatematerial(req, res);
    }

});

router.delete("/material/delete/:key", handle, LmsInstance.deletematerial);


/** Learning Assessment */
router.get("/assessment/get/:key?", handle, LmsInstance.getassessment);

router.post("/assessment/create", handle, async (req, res, next) => {

    try {

        const  fields = [
            { name: 'thumbnail', maxCount: 1 },
        ];

        const result = await uploadFile(req, res, 'uploads/lms/assessment/', ['jpeg', 'jpg', 'png', 'svg'], fields, 'fields');

        // Assign uploaded file names to req.body
        if(result?.files['thumbnail']?.[0]?.filename){
            req.body.thumbnail = result.files['thumbnail'][0].filename;
        }

        // Proceed to skill creation
        LmsInstance.createassessment(req, res);

    } catch (err) {
        LmsInstance.createassessment(req, res);
    }
});

router.patch("/assessment/update/:key", handle, async (req, res, next) => {

    try {

        const  fields = [
            { name: 'thumbnail', maxCount: 1 }
        ];

        const result = await uploadFile(req, res, 'uploads/lms/assessment/', ['jpeg', 'jpg', 'png', 'svg'], fields, 'fields');

        // Assign uploaded file names to req.body
        if(result?.files['thumbnail']?.[0]?.filename){
            req.body.thumbnail = result.files['thumbnail'][0].filename;
        }

        // Proceed with creating the skill after all uploads have completed
        LmsInstance.updateassessment(req, res);

    } catch (err) {
        LmsInstance.updateassessment(req, res);
    }

});

router.delete("/assessment/delete/:key", handle, LmsInstance.deleteassessment);

/** */


/** Reviews */
router.get("/review/get/:key?", handle, LmsInstance.getreviews);
router.patch("/review/update/:key", handle, LmsInstance.updatereview);

/** Upsellings */
router.get("/upselling/:key?", handle, LmsInstance.getupsellinglist);

module.exports = router;
