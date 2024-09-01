const express = require('express');
const router = express.Router();
const man = require('../man/man.js');

// Route to register a new user
router.post('/register', man.register_user);

// Route to login
router.post('/login', man.login_user);

// Route to logout
router.post('/logout', man.logout_user);

module.exports = router;