const express = require('express');
const router = express.Router();
const search_controller = require('../controllers/search_controller');

router.get('/', search_controller.search);

module.exports = router;
