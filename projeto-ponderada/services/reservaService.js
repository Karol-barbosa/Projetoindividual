const Reserva = require('../models/Reserva');

async function criarReserva(dados) {
  // Aqui poderíamos validar se as datas são válidas, se a sala existe, etc.
  const reservaCriada = await Reserva.criarReserva(dados);
  return reservaCriada;
}

async function listarReservas() {
  const reservas = await Reserva.listarReservas();
  return reservas;
}

async function deletarReserva(id) {
  const reservaExcluida = await Reserva.deletarReserva(id);
  return reservaExcluida;
}

async function atualizarStatusReserva(id, novoStatus) {
  const reservaAtualizada = await Reserva.atualizarStatusReserva(id, novoStatus);
  return reservaAtualizada;
}

async function editarReserva(id, dadosAtualizados) {
  const reservaEditada = await Reserva.editarReserva(id, dadosAtualizados);
  return reservaEditada;
}

module.exports = {
  criarReserva,
  listarReservas,
  deletarReserva,
  atualizarStatusReserva,
  editarReserva
};
