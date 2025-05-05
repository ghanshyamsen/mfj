const express = require('express');
const router = express.Router();
const Auth = require('../app/controllers/auth/appAuthController');
const { handle } = require("../app/middleware/auth");
// Create an instance of the class
const authInstance = new Auth();

// Define routes
router.post('/login', authInstance.login);
router.post('/social-login', authInstance.sociallogin);
router.post('/register', (req, res, next) => {

    uploadFile(req, res, 'uploads/documents/', ['jpeg', 'jpg', 'png' , 'pdf', 'doc','docx'], 'business_document', 'multiple').then((result) => {
        if(result.status){
            if(result.files.length > 0){
                req.body.business_document = [];
                result.files.forEach(file => {
                    req.body.business_document.push(file.filename);
                });
            }
        }
        authInstance.register(req, res);
    }).catch((err) => {
        res.status(200).json({status:false, message:err.message});
    });
});
router.post('/send-otp', authInstance.sendotp);
router.post('/forgot-password', authInstance.forgetpassword);
router.patch('/reset-password/:key', authInstance.resetpassword);
router.post('/check-teenger', authInstance.checkteenger);
router.post('/linkedin', authInstance.linkedin);
router.get('/privacy-policy', authInstance.getprivacypolicy);
router.get('/get-config', authInstance.getsiteconfig);

router.get('/refresh-token', handle,  authInstance.refreshtoken);
router.post('/check-exists', authInstance.checkexists);
router.post('/check-number', authInstance.checknumber);




module.exports = router;