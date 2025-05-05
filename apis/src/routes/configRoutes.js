const express = require('express');
const router = express.Router();
const multer = require("multer");
const fs = require('fs');

const { handle } = require("../app/middleware/auth");
const { get, update } = require('../app/controllers/configController');

const directoryPath = 'uploads/logo/';
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

const configUpload = upload.fields([
  { name: 'app_logo', maxCount: 1 },
  { name: 'app_fav_icon', maxCount: 1 }
]);

// Define routes
router.get('/get', handle, get);
router.patch('/update', [ configUpload, handle ], update);

module.exports = router;