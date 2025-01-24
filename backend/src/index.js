const { connectToDatabase } = require('./db');

const express = require('express');
const cors = require('cors');
const serverless = require('serverless-http');

//const AWS = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");
const { S3Client } = require("@aws-sdk/client-s3");

const app = express();

const allowedOrigins = [
    /^https:\/\/.*\.amplifyapp\.com$/, 
    "http://127.0.0.1:3000", 
    "http://localhost:3000"
];

app.use(express.json()); 

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.some(item => {
            if (typeof item === 'string') {
                return item === origin;  // Exact string match
            }
            if (item instanceof RegExp) {
                return item.test(origin);  // Regex match
            }
            return false;
        })) {
            callback(null, true);  // Allow the request if it matches
        } else {
            callback(new Error('Not allowed by CORS'));  // Reject the request
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Add any other methods you're using
    allowedHeaders: ['Content-Type', 'Authorization'],  // Add any other headers you might need
    credentials: true  // Enable cookies if required
}));

// Handle the preflight OPTIONS request
//app.options('*', (req, res) => {
//    //res.header('Access-Control-Allow-Origin', '*');
//    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
//    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//    res.sendStatus(200);  // Respond with status 200 for preflight
//});

app.get('/', (req, res) => {
    res.send('Hello World!ooo!');
});

app.get('/ptest', async (req, res) => {
    try {
        const connection = await connectToDatabase(); // Connect to the database
        const [rows] = await connection.execute('SELECT NOW() AS currentTime'); // Example query
        res.send({ message: 'Hello World! @ !', dbTime: rows[0].currentTime });
    } catch (error) {
        console.error('Error connecting to the database:', error.message);
        res.status(500).send({ error: 'Database connection failed', details: error.message });
    }
});



// CRUD Operations for my_user table

// 1. Create a new user
app.post('/users', async (req, res) => {
    const { text, counter } = req.body;
    if (!text || typeof counter === 'undefined') {
        return res.status(400).send({ error: 'Invalid input: text and counter are required' });
    }
    try {
        const connection = await connectToDatabase();
        const [result] = await connection.execute(
            'INSERT INTO my_user (text, counter) VALUES (?, ?)',
            [text, counter]
        );
        res.status(201).send({ message: 'User created successfully', uid: result.insertId });
    } catch (error) {
        console.error('Error creating user:', error.message);
        res.status(500).send({ error: 'Failed to create user', details: error.message });
    }
});

// 2. Read all users
app.get('/users', async (req, res) => {
    try {
        const connection = await connectToDatabase();
        const [rows] = await connection.execute('SELECT * FROM my_user');
        res.send(rows);
    } catch (error) {
        console.error('Error retrieving users:', error.message);
        res.status(500).send({ error: 'Failed to retrieve users', details: error.message });
    }
});

// 3. Update a user by ID
app.put('/users/:uid', async (req, res) => {
    const { uid } = req.params;
    const { text, counter } = req.body;

    if (!text && typeof counter === 'undefined') {
        return res.status(400).send({ error: 'Invalid input: at least one field (text or counter) is required' });
    }

    try {
        const connection = await connectToDatabase();
        const [result] = await connection.execute(
            'UPDATE my_user SET text = COALESCE(?, text), counter = COALESCE(?, counter) WHERE uid = ?',
            [text, counter, uid]
        );

        if (result.affectedRows === 0) {
            return res.status(404).send({ error: 'User not found' });
        }

        res.send({ message: 'User updated successfully' });
    } catch (error) {
        console.error('Error updating user:', error.message);
        res.status(500).send({ error: 'Failed to update user', details: error.message });
    }
});

// 4. Delete a user by ID
app.delete('/users/:uid', async (req, res) => {
    const { uid } = req.params;

    try {
        const connection = await connectToDatabase();
        const [result] = await connection.execute('DELETE FROM my_user WHERE uid = ?', [uid]);

        if (result.affectedRows === 0) {
            return res.status(404).send({ error: 'User not found' });
        }

        res.send({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error.message);
        res.status(500).send({ error: 'Failed to delete user', details: error.message });
    }
});

const s3 = new S3Client({
    credentials: {
        accessKeyId: 'AKIAQUEVSWROTOQZPDEK',
        secretAccessKey: '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'
    },
    region: "us-east-1"
})

const s3Storage = multerS3({
    s3: s3, // s3 instance
    bucket: "j19mc", // change it as per your project requirement
    acl: "public-read", // storage access type
    metadata: (req, file, cb) => {
        cb(null, {fieldname: file.fieldname})
    },
    key: (req, file, cb) => {
        const fileName = Date.now() + "_" + file.fieldname + "_" + file.originalname;
        cb(null, fileName);
    }
});

// our middleware
const upload = multer({
    storage: s3Storage,
    limits: {
        fileSize: 1024 * 1024 * 5 // 2mb file size
    }
})

// API Endpoint for Upload
app.post("/upload", upload.single("image"), (req, res) => {
    // File successfully uploaded
    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded!" });
    }

    //console.log("start logic");
    //s3.listBuckets((err, data) => {
    //    if (err) {
    //        console.error("Error accessing S3:", err);
    //    } else {
    //        console.log("S3 Buckets:", data.Buckets);
    //    }
    //});
    
    const fileUrl = req.file.location; // S3 file URL
    return res.status(200).json({
        message: "File uploaded successfully!",
        fileUrl: fileUrl,
    });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports.handler = serverless(app);

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