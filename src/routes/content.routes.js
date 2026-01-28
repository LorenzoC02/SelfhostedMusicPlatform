const express = require('express');
const router = express.Router();
const contentController = require('../controllers/content.controller');
const upload = require('../services/storage.service');

router.post('/upload', upload.single('file'), contentController.uploadContent);
router.get('/content', contentController.listContent);
router.get('/content/:id', contentController.getContent);

module.exports = router;
