const mysql = require('mysql2/promise'); 

// Database Configuration
const dbConfig = {
  host: 'j2b.cdtsxl6orqdz.us-east-1.rds.amazonaws.com',       
  user: 'admin', 
  password: '20021224', 
  database: 'prod', 
  port: 3306
};

let dbConnection; // Cache the database connection

// Function to Connect to the Database
const connectToDatabase = async () => {
  if (!dbConnection) {
    try {
      dbConnection = await mysql.createConnection(dbConfig);
      console.log('Connected to RDS MySQL database');
    } catch (error) {
      console.error('Database connection failed:', error.message);
      throw error;
    }
  }
  return dbConnection;
};

// Test Connection (Optional for Debugging)
const testConnection = async () => {
  try {
    const connection = await connectToDatabase();
    const [rows] = await connection.execute('SELECT NOW() AS currentTime');
    console.log('Database Time:', rows[0].currentTime);
  } catch (error) {
    console.error('Test connection failed:', error.message);
  }
};

// Export Functions
module.exports = {
  connectToDatabase,
  testConnection
};
