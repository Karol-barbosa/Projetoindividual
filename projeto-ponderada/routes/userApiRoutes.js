const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const { isAuthenticated } = require('../middleware/authMiddleware');

// POST /api/usuario/registrar
router.post('/registrar', UserController.registrar);

// POST /api/usuario/login
router.post('/login', UserController.login);

// POST /api/usuario/logout
router.post('/logout', isAuthenticated, UserController.logout);

module.exports = router; 