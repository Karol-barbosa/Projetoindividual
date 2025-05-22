const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const ReservaController = require('../controllers/ReservaController');

router.post('/login', UserController.login);
router.post('/reserva', ReservaController.criar);
router.get('/reservas', ReservaController.listar);
router.delete('/reserva/:id', ReservaController.deletar);
router.patch('/reserva/:id/status', ReservaController.atualizarStatus);
router.put('/reserva/:id', ReservaController.editar);


module.exports = router;
