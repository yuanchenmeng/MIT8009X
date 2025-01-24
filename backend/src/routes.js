// routes.js
const express = require('express');

const { upload, uploadImage } = require('./controller/image_uploads');
const { createUser, findUserById, findUserByEmail} = require('./controller/users');
const { createProject, ReadPById, updateProject, delProject, listAllProjects }
 = require('./controller/projects');
 const { getAllContent, getContentById, createContent }
 = require('./controller/covers');

const router = express.Router();

// Define routes
router.post('/upload', upload.single('image'), uploadImage);

router.post('/user', createUser);
router.get('/user/fid/:uid', findUserById);
router.get('/user/fe/:email', findUserByEmail);

router.post('/projects', createProject);
router.get('/projects/:pid', ReadPById);
router.put('/projects/:pid', updateProject);
router.delete('/projects/:pid', delProject);
router.get('/projects', listAllProjects);

router.post('/cover', createContent);
router.get('/cover/:cid', getContentById);
router.get('/cover', getAllContent);

module.exports = router;