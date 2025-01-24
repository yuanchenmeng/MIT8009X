// config/corsConfig.js
const cors = require('cors');

// Define allowed origins (for example)
const allowedOrigins = [
    /^https:\/\/.*\.amplifyapp\.com$/, 
    "http://127.0.0.1:3000", 
    "http://localhost:3000"
];

const corsOptions = {
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
};

module.exports = corsOptions;

// Handle the preflight OPTIONS request
//app.options('*', (req, res) => {
//    //res.header('Access-Control-Allow-Origin', '*');
//    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
//    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//    res.sendStatus(200);  // Respond with status 200 for preflight
//});