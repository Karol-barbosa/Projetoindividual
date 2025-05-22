const reservaService = require('../services/reservaService');

async function criar(req, res) {
  const { usuario_id, sala_id, data_checkin, data_checkout, status } = req.body;

  try {
    const novaReserva = await reservaService.criarReserva({
      usuario_id,
      sala_id,
      data_checkin,
      data_checkout,
      status
    });

    res.status(201).json(novaReserva);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao criar reserva', detalhes: error.message });
  }
}

async function listar(req, res) {
  try {
    const reservas = await reservaService.listarReservas();
    res.status(200).json(reservas);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao listar reservas', detalhes: error.message });
  }
}

async function deletar(req, res) {
  const { id } = req.params;

  try {
    const reserva = await reservaService.deletarReserva(id);

    if (!reserva) {
      return res.status(404).json({ erro: 'Reserva não encontrada' });
    }

    res.status(200).json({ mensagem: 'Reserva cancelada com sucesso', reserva });
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao cancelar reserva', detalhes: error.message });
  }
}

async function atualizarStatus(req, res) {
  const { id } = req.params;
  const { status } = req.body;

  const statusValidos = ['pendente', 'confirmada', 'cancelada'];

  if (!statusValidos.includes(status)) {
    return res.status(400).json({ erro: 'Status inválido. Use: pendente, confirmada ou cancelada.' });
  }

  try {
    const reserva = await reservaService.atualizarStatusReserva(id, status);

    if (!reserva) {
      return res.status(404).json({ erro: 'Reserva não encontrada' });
    }

    res.status(200).json({ mensagem: 'Status atualizado com sucesso', reserva });
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao atualizar status', detalhes: error.message });
  }
}

async function editar(req, res) {
  const { id } = req.params;
  const dados = req.body;

  try {
    const reserva = await reservaService.editarReserva(id, dados);

    if (!reserva) {
      return res.status(404).json({ erro: 'Reserva não encontrada' });
    }

    res.status(200).json({ mensagem: 'Reserva atualizada com sucesso', reserva });
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao atualizar reserva', detalhes: error.message });
  }
}

module.exports = {
  criar,
  listar,
  deletar,
  atualizarStatus,
  editar
};
