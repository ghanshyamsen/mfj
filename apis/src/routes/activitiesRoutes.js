const express = require("express");
const router = express.Router();
const Activitie = require("../app/controllers/activitieController");
const { handle } = require("../app/middleware/auth");

const multer = require("multer");
const fs = require('fs');

const directoryPath = 'uploads/activitie/';
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

const activitieUpload = upload.fields([
    { name: 'image', maxCount: 1 }
]);

// Create an instance of the class
const activitiesInstance = new Activitie();

// Define routes
router.get("/get/:key?", handle, activitiesInstance.get);
router.post("/create", [activitieUpload, handle], activitiesInstance.create);
router.patch("/update/:key", [activitieUpload, handle], activitiesInstance.update);
router.delete("/delete/:key", handle, activitiesInstance.delete);

module.exports = router;
