const express = require('express');
const router = express.Router({ mergeParams: true }); // MERGEPARAMS ALLOWS US TO GET PROJECTID FROM THE PARENT ROUTER
const fileController = require('../controllers/file.controller');
const verifyToken = require('../middleware/auth.middleware');

// ALL FILE ROUTES ARE PROTECTED
router.use(verifyToken);

// GET /api/projects/:projectId/files - GET ALL FILES FOR A PROJECT
router.get('/', fileController.getFiles);

// GET /api/files/:fileId - GET A SINGLE FILE BY ID
router.get('/:fileId', fileController.getFileById);

// POST /api/projects/:projectId/files - CREATE A NEW FILE IN A PROJECT
router.post('/', fileController.createFile);

// POST /api/projects/:projectId/files/folder - CREATE A NEW FOLDER IN A PROJECT
router.post('/folder', fileController.createFolder);

// PUT /api/files/:fileId - UPDATE A FILE
router.put('/:fileId', fileController.updateFile);

// DELETE /api/files/:fileId - DELETE A FILE
router.delete('/:fileId', fileController.deleteFile);

module.exports = router;