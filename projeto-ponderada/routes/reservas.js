const express = require('express');
const router = express.Router();
const ReservaController = require('../controllers/ReservaController');
const { isAuthenticated } = require('../middleware/authMiddleware');

// Aplicar isAuthenticated a todas as rotas neste roteador
router.use(isAuthenticated);

// GET /api/reservas/hoje - Listar todas as reservas para o dia atual
router.get('/hoje', ReservaController.listarReservasDeHoje); // Nova função no controller

// POST /api/reservas - Criar uma nova reserva
router.post('/', ReservaController.criar);

// GET /api/reservas - Listar todas as reservas (geral, pode ser útil para admin no futuro)
router.get('/', ReservaController.listar);

// DELETE /api/reservas/:id - Deletar uma reserva
router.delete('/:id', ReservaController.deletar);

// PATCH /api/reservas/:id/status - Atualizar o status de uma reserva
router.patch('/:id/status', ReservaController.atualizarStatus);

// PUT /api/reservas/:id - Editar uma reserva completa
router.put('/:id', ReservaController.editar);

// TODO: Adicionar rota para listar reservas do usuário logado para o dia atual
// router.get('/minhas/hoje', ReservaController.listarMinhasReservasDeHoje);

module.exports = router;
