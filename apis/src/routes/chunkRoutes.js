const express = require("express");
const router = express.Router();

const multer = require('multer');
const fs = require('fs-extra');
const path = require('path');
const cors = require('cors');


const uploadDir = path.join(__dirname, '../../uploads/chunk');


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      // Use a temporary filename
      cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({ storage: storage }).single('chunk');

router.post('/upload', (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            return res.status(500).send(err);
        }

        const { filename, chunkIndex, totalChunks } = req.body;
        const tempPath = req.file.path;
        const targetPath = path.join(uploadDir, `${filename}.part_${chunkIndex}`);

        // Rename the temporary file to the desired chunk filename
        fs.rename(tempPath, targetPath, (err) => {
            if (err) {
                return res.status(500).send(err);
            }

            if (parseInt(chunkIndex) === parseInt(totalChunks) - 1) {
                assembleChunks(filename, totalChunks);
            }

            res.status(200).send('Chunk uploaded');
        });
    });
});

async function assembleChunks(filename, totalChunks) {
    const finalFilePath = path.join(uploadDir, filename);
    const writeStream = fs.createWriteStream(finalFilePath);

    for (let i = 0; i < totalChunks; i++) {
        const chunkPath = path.join(uploadDir, `${filename}.part_${i}`);
        const data = fs.readFileSync(chunkPath);
        writeStream.write(data);
        fs.unlinkSync(chunkPath);
    }

    writeStream.end();
}


module.exports = router;
