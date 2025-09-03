
const express = require('express');
const router = express.Router();
const { executeCode } = require('../controllers/code.controller');

router.post('/execute', executeCode);

module.exports = router;
