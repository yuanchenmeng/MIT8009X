const { connectToDatabase } = require('../db');

// Create a user function
const createUser = async (req, res) => {
  const { email, name, password, type } = req.body;

  // Validate inputs (simple validation)
  if (!email || !name || !password || !type) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const query = `INSERT INTO users (email, name, password, type) VALUES (?, ?, ?, ?)`;
  
  try {
    const connection = await connectToDatabase();
    const [result] = await connection.execute(query, [email, name, password, type]);

    // Return success response with the inserted user's id
    res.status(201).json({ message: 'User created successfully', uid: result.insertId });
  } catch (err) {
    console.error('Error inserting user:', err);
    res.status(500).json({ message: 'Error creating user' });
  }
};

// Find user by ID function
const findUserById = async (req, res) => {
  const { uid } = req.params;

  const query = `SELECT * FROM users WHERE uid = ?`;

  try {
    const connection = await connectToDatabase();
    const [results] = await connection.execute(query, [uid]);

    if (results.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ user: results[0] });
  } catch (err) {
    console.error('Error fetching user:', err);
    res.status(500).json({ message: 'Error finding user' });
  }
};

// Find user by email function
const findUserByEmail = async (req, res) => {
  const { email } = req.params;

  const query = `SELECT * FROM users WHERE email = ?`;

  try {
    const connection = await connectToDatabase();
    const [results] = await connection.execute(query, [email]);

    if (results.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ user: results[0] });
  } catch (err) {
    console.error('Error fetching user:', err);
    res.status(500).json({ message: 'Error finding user' });
  }
};

module.exports = {
  createUser,
  findUserById,
  findUserByEmail,
};
