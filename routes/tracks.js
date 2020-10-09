const express = require('express');
const router = express.Router();
const tracks_controller = require('../controllers/tracks_controller');

router.get('/', tracks_controller.tracks);

module.exports = router;
