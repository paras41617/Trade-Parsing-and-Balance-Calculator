const express = require('express');
const router = express.Router();
const multer = require('multer');
const tradeController = require('../controllers');

// Multer setup for in-memory file upload
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Trade routes
router.post('/upload-csv', upload.single('file'), tradeController.uploadCSV);

// Balance route
router.post('/balance', tradeController.getBalance);

module.exports = router;
