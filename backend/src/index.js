const express = require('express');
const cors = require('cors');
const serverless = require('serverless-http');

const corsOptions = require('./config/cors');
const { connectToDatabase } = require('./db');
const testRoutes = require('./test_routes');
const routes = require('./routes');

const app = express();

app.use(express.json()); 
app.use(cors(corsOptions));

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

app.use('/test', testRoutes);
app.use('/api', routes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports.handler = serverless(app);