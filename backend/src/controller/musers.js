// controllers/musers.js
const { connectToDatabase } = require('../db');

// 1. Create a new user
const createUserSam = async (req, res) => {
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
};

// 2. Read all users
const getAllUsersSam = async (req, res) => {
    try {
        const connection = await connectToDatabase();
        const [rows] = await connection.execute('SELECT * FROM my_user');
        res.send(rows);
    } catch (error) {
        console.error('Error retrieving users:', error.message);
        res.status(500).send({ error: 'Failed to retrieve users', details: error.message });
    }
};

// 3. Update a user by ID
const UpdateUserSam = async (req, res) => {
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
};

// 4. Delete a user by ID
const DelUserSam = async (req, res) => {
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
};

module.exports = {
    createUserSam,
    getAllUsersSam,
    UpdateUserSam,
    DelUserSam
};