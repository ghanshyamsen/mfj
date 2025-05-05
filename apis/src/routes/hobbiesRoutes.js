const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require('fs');

const Hobbies = require("../app/controllers/hobbiesController");
const { handle } = require("../app/middleware/auth");

const directoryPath = 'uploads/hobbies/';
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

const hobbiesUpload = upload.fields([
    { name: 'image', maxCount: 1 }
]);


// Create an instance of the class
const hobbiesInstance = new Hobbies();

// Define routes
router.get("/get/:key?", handle, hobbiesInstance.get);
router.post("/create", [hobbiesUpload, handle], hobbiesInstance.create);
router.patch("/update/:key", [hobbiesUpload, handle], hobbiesInstance.update);
router.delete("/delete/:key", handle, hobbiesInstance.delete);

module.exports = router;
