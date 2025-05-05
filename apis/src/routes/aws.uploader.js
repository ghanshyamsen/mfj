const express = require('express');
const router = express.Router();
const multer = require("multer");
const fs = require('fs');
const path = require('path');

const { S3Client, CreateMultipartUploadCommand, UploadPartCommand, CompleteMultipartUploadCommand } = require("@aws-sdk/client-s3");






module.exports = router;