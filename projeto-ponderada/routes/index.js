const express = require('express');
const router = express.Router();

// Controladores e Middlewares
const UserController = require('../controllers/userController');
const ReservaController = require('../controllers/ReservaController');
const { isAuthenticated, alreadyLoggedIn } = require('../middleware/authMiddleware');

// Roteadores de API
const userApiRoutes = require('./userApiRoutes');
const reservaApiRoutes = require('./reservas'); // Este é o nosso routes/reservas.js para API

// Roteador para Páginas de Reserva
const reservaPageRoutes = require('./reservaPageRoutes');

// === ROTAS DE PÁGINA PRINCIPAIS ===
router.get('/dashboard', isAuthenticated, (req, res) => {
    console.log('[routes/index.js] GET /dashboard -> Renderizando dashboard.');
    res.render('dashboard', { 
        titulo: 'Dashboard', 
        userName: req.session.userName || 'Usuário' 
    });
});

router.post('/api/usuario/registrar', UserController.registrar);
router.post('/api/usuario/login', UserController.login);
router.post('/api/usuario/logout', isAuthenticated, UserController.logout);
router.get('/login', alreadyLoggedIn, (req, res) => {
    console.log('[routes/index.js] GET /login -> Renderizando página de login.');
    res.render('auth/login', { titulo: 'Login' });
});
router.get('/registrar', alreadyLoggedIn, (req, res) => {
    console.log('[routes/index.js] GET /registrar -> Renderizando página de registro.');
    res.render('auth/registrar', { titulo: 'Registrar' });
});

router.post('/api/reserva', isAuthenticated, ReservaController.criar); 
router.get('/api/reservas', isAuthenticated, ReservaController.listar);
router.delete('/api/reserva/:id', isAuthenticated, ReservaController.deletar);
router.patch('/api/reserva/:id/status', isAuthenticated, ReservaController.atualizarStatus);
router.put('/api/reserva/:id', isAuthenticated, ReservaController.editar);

// === MONTAGEM DOS ROTEADORES DE API ===
router.use('/api/usuario', userApiRoutes);
router.use('/api/reservas', reservaApiRoutes);

// === MONTAGEM DO ROTEADOR DE PÁGINAS DE RESERVA ===
router.use('/reservas-pages', isAuthenticated, reservaPageRoutes); 

console.log('[routes/index.js] Roteador principal configurado e todos os sub-roteadores montados.');

module.exports = router;
