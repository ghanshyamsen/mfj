const express = require("express");
const router = express.Router();
const { exec } = require('child_process');

const ffmpeg = require('fluent-ffmpeg');
const ffmpegStatic = require('ffmpeg-static');
const path = require('path');

// Set ffmpeg path
ffmpeg.setFfmpegPath(ffmpegStatic);

const Chat = require('../app/controllers/chatController');

// Create an instance of the class
const chatInstance = new Chat();

function processVideo(videoPath, outputThumbPath) {
    return new Promise((resolve, reject) => {
        ffmpeg.ffprobe(videoPath, (err, metadata) => {
            if (err) return reject(err);

            const duration = metadata.format.duration; // Video length in seconds
            const thumbnailTime = Math.min(5, Math.floor(duration / 2)); // Capture at 5s or middle of the video

            const fileName = generateRandomKey(10)+'_F.png';

            // Generate thumbnail
            ffmpeg(videoPath)
                .screenshots({
                    timestamps: [thumbnailTime], // Capture frame at specific second
                    filename: fileName,
                    folder: outputThumbPath,
                    //size: '320x240' // Adjust size if needed
                })
                .on('end', () => {
                    resolve({ duration, thumbnail: `${process.env.MEDIA_URL}chat/thumbnail/${fileName}`});
                })
                .on('error', (err) => reject(err));
        });
    });
}

function getRealAudioDuration(audioPath) {
    return new Promise((resolve, reject) => {
        const cmd = `ffmpeg -i "${audioPath}" -vn -af "volumedetect" -f null - 2>&1 | grep "time="`;

        exec(cmd, (error, stdout) => {
            if (error) return reject(error);

            const matches = stdout.match(/time=(\d+):(\d+):([\d.]+)/);
            if (!matches) return reject(new Error('Could not determine duration'));

            const hours = parseInt(matches[1], 10);
            const minutes = parseInt(matches[2], 10);
            const seconds = parseFloat(matches[3]);

            const totalSeconds = hours * 3600 + minutes * 60 + seconds;
            resolve(totalSeconds);
        });
    });
}

function getAudioDuration(filePath) {
    const command = `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${filePath}"`;

    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error('Error:', error);
        return;
      }
      if (stderr) {
        console.error('stderr:', stderr);
        return;
      }
      console.log(`Duration: ${parseFloat(stdout).toFixed(2)} seconds`);
    });
}


// Define routes
router.post("/get-messages", chatInstance.get);
router.get("/get-chat-list/:key", chatInstance.getchatlist);
router.post("/get-room", chatInstance.getroom);
router.patch("/read", chatInstance.readmessage);
router.post("/send-message", (req, res, next) => {
    uploadFile(req, res, 'uploads/chat/', ['jpeg', 'jpg', 'png', 'pdf', 'doc', 'docx','webm','mp4','acc','mpeg','mp3','wav','3gp','3gpp'], 'media', 'multiple').then((result) => {
        if(result.status){

            req.body.media = result.files;

            let sendReq =  true;

            if(result.files?.[0]?.mimetype === 'video/mp4'){
                sendReq = false;
                let upFile = result.files?.[0];

                processVideo(upFile.path, 'uploads/chat/thumbnail')
                .then(({ duration, thumbnail }) => {

                    req.body.media_thumbnail = thumbnail;
                    req.body.media_duration = 0+':'+duration;

                    chatInstance.create(req, res);
                })
                .catch(console.error);

            }

            if(result.files?.[0]?.mimetype === 'audio/webm' || result.files?.[0]?.mimetype === 'audio/wav' || result.files?.[0]?.mimetype === 'audio/mp3'){
                sendReq = false;

                let upFile = result.files?.[0];

                getRealAudioDuration(upFile.path).then((duration) => {
                    req.body.media_duration = `0:${duration}`; // Convert format if needed
                    chatInstance.create(req, res);
                })

                //getAudioDuration(upFile.path);

            }

            if(sendReq){
                chatInstance.create(req, res);
            }

        }else{
            chatInstance.create(req, res);
        }
    }).catch((err) => {
        res.status(200).json({status:false, message:err.message});
    });
});

router.get("/unread-count", chatInstance.unreadcount);


module.exports = router;
