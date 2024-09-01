const express = require('express');
const router = express.Router();
const man = require('../man/man.js');

// Route to upload videos
router.post('/upload', man.uploadVideo)

// Route to get specific author videos
router.get('/myVideos', man.authorVideo)

router.get('/video/:id', man.getVideo)

// Route to delete specific video
router.delete('/delete/:id', man.deleteVideo)

// Route to reformat video
router.post('/reformat', man.reformatVideo)

// Route to download video
router.post('/download', man.downloadVideo)

module.exports = router;