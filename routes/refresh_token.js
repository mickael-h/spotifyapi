const express = require('express');
const login_controller = require('../controllers/login_controller');
const router = express.Router();

router.get('/', login_controller.refreshToken);

module.exports = router;
