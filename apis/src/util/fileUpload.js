const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { unlink } = require('node:fs/promises');


// Global function to create a Multer instance with specific configurations
function createMulterInstance(destinationPath, fileTypes, uploadType, fieldName, limits) {

    // Create Directory
    try {
        if (!fs.existsSync(destinationPath)) {
            fs.mkdirSync(destinationPath, { recursive: true });
        }
    } catch (error) {
        throw new Error(`Failed to create directory: ${error.message}`);
    }

    // Set up storage engine
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, destinationPath); // Save files to the specified directory
        },
        filename: function (req, file, cb) {
            const originalName = file.originalname;
            const extname = path.extname(file.originalname).toLowerCase();
            const uniqueFileName = generateRandomKey(10) +'_F'+extname; //originalName;
            cb(null, uniqueFileName);
        }
    });

    // Check file type
    function checkFileType(file, cb) {
        const filetypes = new RegExp(fileTypes.join('|'));
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error(`Error: Only ${fileTypes.join(', ')} files are allowed!`));
        }
    }

    // Initialize Multer with storage and file filter
    const upload = multer({
        storage: storage,
        limits: { fileSize: limits * 1024 * 1024 }, // Limit file size to 100MB
        fileFilter: function (req, file, cb) {
            checkFileType(file, cb);
        }
    });

    // Return the configured Multer upload function based on the upload type
    if (uploadType === 'single') {
        return upload.single(fieldName);
    } else if (uploadType === 'multiple') {
        return upload.array(fieldName, 10); // set a limit, e.g., 10 files
    } else if (uploadType === 'fields') {
        return upload.fields(fieldName); // set a limit, e.g., 10 files
    } else {
        throw new Error('Invalid upload type. Use "single" or "multiple".');
    }
}

// Global file upload handler
global.uploadFile = function (req, res, destinationPath, fileTypes, fieldName = 'file', uploadType = 'single', limits = 100) {
    return new Promise((resolve, reject) => {
        const upload = createMulterInstance(destinationPath, fileTypes, uploadType, fieldName, limits);

        upload(req, res, (err) => {

            if (err instanceof multer.MulterError) {
                // A Multer error occurred when uploading.
                if (err.code === 'LIMIT_FILE_SIZE') {
                  reject({ status: false, code:err.code, message: `File too large. Max size is ${limits} MB.` });
                }
                reject({ status: false, message: err.message });
            } else if (err) {
                reject({ status: false, message: err.message });
            } else {
                if (uploadType === 'single') {
                    if (!req.file) {
                        resolve({ status: false, message: 'No file selected' });
                    } else {
                        resolve({ status: true, message: 'File uploaded', file: req.file });
                    }
                } else if (uploadType === 'multiple') {
                    if (!req.files || req.files.length === 0) {
                        resolve({ status: false, message: 'No files selected' });
                    } else {
                        resolve({ status: true, message: 'Files uploaded', files: req.files });
                    }
                }else if (uploadType === 'fields') {
                    if (!req.files || req.files.length === 0) {
                        resolve({ status: false, message: 'No files selected' });
                    } else {
                        resolve({ status: true, message: 'Files uploaded', files: req.files });
                    }
                }
            }
        });
    });
};

// Unlink a file from the server
global.unlinkFile = async function (path, name) {
    await unlink(path + name);
}
