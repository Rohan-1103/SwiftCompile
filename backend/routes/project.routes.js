const express = require('express');
const router = express.Router();
const projectController = require('../controllers/project.controller');
const fileController = require('../controllers/file.controller');
const verifyToken = require('../middleware/auth.middleware');

// ALL PROJECT ROUTES ARE PROTECTED
router.use(verifyToken);

// GET /api/projects - GET ALL PROJECTS FOR THE USER
router.get('/', projectController.getProjects);

// POST /api/projects - CREATE A NEW PROJECT
router.post('/', projectController.createProject);

// GET /api/projects/:id - GET A SINGLE PROJECT BY ID
router.get('/:id', projectController.getProjectById);

// POST /api/projects/:id/sync - SYNC FILESYSTEM TO DB
router.post('/:id/sync', fileController.syncFilesystemToDb);

module.exports = router;