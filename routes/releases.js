const express = require('express');
const router = express.Router();
const releases_controller = require('../controllers/releases_controller');

router.get('/', releases_controller.releases);

module.exports = router;
