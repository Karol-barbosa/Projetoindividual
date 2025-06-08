const express = require('express');
const router = express.Router();

// Rota para exibir o formulário de login
router.get('/login', (req, res) => {
  res.render('auth/login');
});

// Rota para exibir o formulário de cadastro
router.get('/registrar', (req, res) => {
  res.render('auth/registrar');
});

module.exports = router;
