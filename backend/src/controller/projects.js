const { connectToDatabase } = require('../db');

// Create Project function
const createProject = async (req, res) => {
  const { keywords, text, tags, cid, uid } = req.body;

  if (!uid) {
    return res.status(400).json({ message: 'uid is required' });
  }

  const query = `
    INSERT INTO projects (keywords, text, tags, cid, uid)
    VALUES (?, ?, ?, ?, ?)
  `;

  try {
    const connection = await connectToDatabase();
    const [result] = await connection.execute(query, [keywords, text, tags, cid, uid]);

    res.status(201).json({ message: 'Project created successfully', pid: result.insertId });
  } catch (err) {
    console.error('Error creating project:', err);
    res.status(500).json({ message: 'Error creating project' });
  }
};

const listAllProjects = async (req, res) => {
    const query = `SELECT * FROM projects`;
  
    try {
      const connection = await connectToDatabase();
      const [results] = await connection.execute(query);
  
      if (results.length === 0) {
        return res.status(404).json({ message: 'No projects found' });
      }
  
      res.status(200).json({ projects: results });
    } catch (err) {
      console.error('Error fetching projects:', err);
      res.status(500).json({ message: 'Error fetching projects' });
    }
};


// Read Project by ID function
const ReadPById = async (req, res) => {
  const { pid } = req.params;

  const query = `SELECT * FROM projects WHERE pid = ?`;

  try {
    const connection = await connectToDatabase();
    const [results] = await connection.execute(query, [pid]);

    if (results.length === 0) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.status(200).json({ project: results[0] });
  } catch (err) {
    console.error('Error fetching project:', err);
    res.status(500).json({ message: 'Error fetching project' });
  }
};

// Update Project by ID function
const updateProject = async (req, res) => {
  const { pid } = req.params;
  const { keywords, text, tags, cid, uid } = req.body;

  const query = `
    UPDATE projects
    SET keywords = ?, text = ?, tags = ?, cid = ?, uid = ?
    WHERE pid = ?
  `;

  try {
    const connection = await connectToDatabase();
    const [result] = await connection.execute(query, [keywords, text, tags, cid, uid, pid]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.status(200).json({ message: 'Project updated successfully' });
  } catch (err) {
    console.error('Error updating project:', err);
    res.status(500).json({ message: 'Error updating project' });
  }
};

// Delete Project by ID function
const delProject = async (req, res) => {
  const { pid } = req.params;

  const query = `DELETE FROM projects WHERE pid = ?`;

  try {
    const connection = await connectToDatabase();
    const [result] = await connection.execute(query, [pid]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.status(200).json({ message: 'Project deleted successfully' });
  } catch (err) {
    console.error('Error deleting project:', err);
    res.status(500).json({ message: 'Error deleting project' });
  }
};

module.exports = {
  createProject,
  ReadPById,
  updateProject,
  delProject,
  listAllProjects
};
