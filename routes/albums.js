const express = require('express');
const router = express.Router();
const albums_controller = require('../controllers/albums_controller');

router.get('/', albums_controller.albums);

module.exports = router;
