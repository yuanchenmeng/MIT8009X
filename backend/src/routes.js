// routes.js
const express = require('express');

const { upload, uploadImage } = require('./controller/image_uploads'); // Import from controller

const router = express.Router();

// Define routes
router.post('/upload', upload.single('image'), uploadImage);

module.exports = router;