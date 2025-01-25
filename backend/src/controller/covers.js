const { connectToDatabase } = require('../db');

// Get all content
const getAllContent = async (req, res) => {
  const query = `SELECT * FROM covers`;

  try {
    const connection = await connectToDatabase();
    const [results] = await connection.execute(query);

    if (results.length === 0) {
      return res.status(404).json({ message: 'No content found' });
    }

    res.status(200).json({ content: results });
  } catch (err) {
    console.error('Error fetching content:', err);
    res.status(500).json({ message: 'Error fetching content' });
  }
};

// Get content by ID
const getContentById = async (req, res) => {
  const { cid } = req.params;
  const query = `SELECT * FROM covers WHERE cid = ?`;

  try {
    const connection = await connectToDatabase();
    const [results] = await connection.execute(query, [cid]);

    if (results.length === 0) {
      return res.status(404).json({ message: 'Content not found' });
    }

    res.status(200).json({ content: results[0] });
  } catch (err) {
    console.error('Error fetching content by ID:', err);
    res.status(500).json({ message: 'Error fetching content by ID' });
  }
};

// Create new content
const createContent = async (req, res) => {
  const { url } = req.body;

  // Add headers to the response for all cases
  res.set('Access-Control-Allow-Origin', '*'); // Allow all origins (CORS)
  res.set('Access-Control-Allow-Methods', 'POST, GET, OPTIONS'); // Allowed HTTP methods
  res.set('Content-Type', 'application/json'); // Set response content type to JSON
  //res.set('Access-Control-Allow-Credentials', 'true');
  //console.log('Headers added to response:', res.getHeaders());

  if (!url) {
    return res.status(400).json({ message: 'URL is required' });
  }

  const query = `INSERT INTO covers (url) VALUES (?)`;

  try {
    const connection = await connectToDatabase();
    const [result] = await connection.execute(query, [url]);

    res.status(201).json({ message: 'Content created successfully', cid: result.insertId });
  } catch (err) {
    console.error('Error creating content:', err);
    res.status(500).json({ message: 'Error creating content' });
  }
};

module.exports = {
  getAllContent,
  getContentById,
  createContent,
};
