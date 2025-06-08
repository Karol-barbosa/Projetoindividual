const express = require('express');
const router = express.Router();
const ReservaController = require('../controllers/ReservaController');
const { isAuthenticated } = require('../middleware/authMiddleware');

// Aplicar isAuthenticated a todas as rotas neste roteador
router.use(isAuthenticated);

// GET /reservas-pages/reservas-view - Página de listagem de reservas (se ainda for usada)
router.get('/reservas-view', ReservaController.renderizarLista);

// GET /reservas-pages/reservas/novo - Página com o formulário para nova reserva
router.get('/reservas/novo', ReservaController.renderizarFormulario);

module.exports = router; 