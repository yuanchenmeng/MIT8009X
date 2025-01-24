// routes/test_routes.js
const express = require('express');
const { createUserSam, getAllUsersSam, UpdateUserSam, DelUserSam } 
= require('./controller/musers');

const router = express.Router();

// Define routes
router.post('/users', createUserSam); // Create a new user
router.get('/users', getAllUsersSam); // Get all users
router.put('/users/:uid', UpdateUserSam); 
router.delete('/users/:uid', DelUserSam); 

module.exports = router;