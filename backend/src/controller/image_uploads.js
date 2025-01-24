// controllers/image_uploads.js
const multer = require('multer');
const multerS3 = require('multer-s3');
const { S3Client } = require('@aws-sdk/client-s3');
//const AWS = require('aws-sdk');

// Set up AWS S3 client
const s3 = new S3Client({
    credentials: {
        accessKeyId: 'AKIAQUEVSWROTOQZPDEK',
        secretAccessKey: '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'
    },
    region: "us-east-1"
})

// S3 storage configuration
const s3Storage = multerS3({
    s3: s3, // s3 instance
    bucket: "j19mc", 
    acl: "public-read", // storage access type
    metadata: (req, file, cb) => {
        cb(null, {fieldname: file.fieldname})
    },
    key: (req, file, cb) => {
        const fileName = Date.now() + "_" + file.fieldname + "_" + file.originalname;
        cb(null, fileName);
    }
});
// multer upload configuration
const upload = multer({
    storage: s3Storage,
    limits: {
        fileSize: 1024 * 1024 * 5, // 5 MB
    },
});

// File upload controller function
const uploadImage = (req, res) => {
    // If no file is uploaded
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded!' });
    }

    // Get the file URL from the S3 response
    const fileUrl = req.file.location;

    // Send success response with the file URL
    return res.status(200).json({
        message: 'File uploaded successfully!',
        fileUrl: fileUrl,
    });
};

module.exports = {
    upload,
    uploadImage,
};


// AWS S3 Configuration
//const s3 = new AWS.S3({
//    accessKeyId: 'AKIAQUEVSWROTOQZPDEK',
//    secretAccessKey: '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',
//    region: 'us-east-1', 
//});

// Configure Multer to upload files to S3
/*
const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'j19mc',
        acl: "public-read", // File access: public or private
        contentType: multerS3.AUTO_CONTENT_TYPE, // Automatically detect content type
        key: (req, file, cb) => {
            const timestamp = Date.now();
            const uniqueFileName = `${timestamp}-${file.originalname}`;
            cb(null, uniqueFileName); // File name format
        },
    }),
    fileFilter: (req, file, cb) => {
        // Accept images only
        if (!file.mimetype.startsWith("image/")) {
            return cb(new Error("Only image files are allowed!"), false);
        }
        cb(null, true);
    },
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB file size limit
});*/

// Global Error Handler for Uploads
//app.use((err, req, res, next) => {
//    console.error(err.message);
//    if (err.code === "LIMIT_FILE_SIZE") {
//        return res.status(400).json({ error: "File size is too large. Max 5MB allowed!" });
//    }
//    console.log("Global Handle");
//    return res.status(500).json({ error: err.message });
//});