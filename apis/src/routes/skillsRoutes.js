const express = require("express");
const router = express.Router();
const multer = require("multer");

const fs = require('fs');

const Skills = require("../app/controllers/skillController");
const VolunteerSkills = require("../app/controllers/volunteerSkillController");
const { handle } = require("../app/middleware/auth");

const directoryPath = 'uploads/skills/';
if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath, { recursive: true });
}
// Define storage options
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, directoryPath);
    },
    filename: function (req, file, cb) {
        // Determine the field name and generate a unique filename
        const fieldName = file.fieldname;
        const originalName = file.originalname;
        const uniqueFileName = generateRandomKey(10) + originalName;
        cb(null, uniqueFileName);
    }
});

// Create a Multer instance with the storage options
const upload = multer({ storage: storage });

const skillUpload = upload.fields([
    { name: 'image', maxCount: 1 }
]);


// Create an instance of the class
const skillsInstance = new Skills();
const volunteerSkillsInstance = new VolunteerSkills();

// Define routes
router.get("/get/:key?", handle, skillsInstance.get);
router.post("/create", [skillUpload, handle], skillsInstance.create);
router.patch("/update/:key", [skillUpload, handle], skillsInstance.update);
router.delete("/delete/:key", handle, skillsInstance.delete);

// Define routes
router.get("/volunteer/get/:key?", handle, volunteerSkillsInstance.get);
router.post("/volunteer/create", [skillUpload, handle], volunteerSkillsInstance.create);
router.patch("/volunteer/update/:key", [skillUpload, handle], volunteerSkillsInstance.update);
router.delete("/volunteer/delete/:key", handle, volunteerSkillsInstance.delete);

module.exports = router;
