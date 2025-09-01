const express = require('express');
const router = express.Router({ mergeParams: true }); // MERGEPARAMS ALLOWS US TO GET PROJECTID FROM THE PARENT ROUTER
const fileController = require('../controllers/file.controller');
const verifyToken = require('../middleware/auth.middleware');

// ALL FILE ROUTES ARE PROTECTED
router.use(verifyToken);

// POST /api/projects/:projectId/files - CREATE A NEW FILE IN A PROJECT
router.post('/', fileController.createFile);

// PUT /api/files/:fileId - UPDATE A FILE
router.put('/:fileId', fileController.updateFile);

// DELETE /api/files/:fileId - DELETE A FILE
router.delete('/:fileId', fileController.deleteFile);

module.exports = router;