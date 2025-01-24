// routes/test_routes.js
const express = require('express');
const { createUserSam, getAllUsersSam, UpdateUserSam, DelUserSam } 
= require('./controller/musers');

const router = express.Router();

// Define routes
router.post('/users', createUserSam);
router.get('/users', getAllUsersSam);
router.put('/users/:uid', UpdateUserSam); 
router.delete('/users/:uid', DelUserSam); 

module.exports = router;