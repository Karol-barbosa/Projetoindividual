const Reserva = require('../models/Reserva');

async function criarReserva(dados) {
    console.log('[reservaService.js] Função criarReserva chamada com dados:', dados);
    try {
        // Aqui poderíamos validar se as datas são válidas, se a sala existe, etc.
        console.log('[reservaService.js] Chamando Reserva.criarReserva (Model) com dados:', dados);
        const reservaCriada = await Reserva.criarReserva(dados);
        
        if (!reservaCriada) {
            console.error('[reservaService.js] Reserva.criarReserva (Model) retornou null ou undefined');
            // Você pode querer lançar um erro aqui ou retornar null para o controller tratar
            throw new Error('Modelo não conseguiu criar a reserva.');
        }
        
        console.log('[reservaService.js] Reserva criada pelo modelo:', reservaCriada);
        return reservaCriada;
    } catch (error) {
        console.error('[reservaService.js] Erro ao tentar criar reserva no serviço:', error);
        // Propagar o erro para o controller, que então enviará uma resposta 500.
        throw error; 
    }
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

// Nova função para buscar reservas por data
async function buscarReservasPorData(data) {
  console.log(`[reservaService.js] Função buscarReservasPorData chamada para data: ${data}`);
  try {
    // Chamará a função correspondente no modelo Reserva
    const reservas = await Reserva.buscarPorData(data);
    console.log(`[reservaService.js] Reservas encontradas pelo modelo para ${data}: ${reservas ? reservas.length : 0}`);
    return reservas;
  } catch (error) {
    console.error(`[reservaService.js] Erro ao buscar reservas por data (${data}):`, error);
    throw error; // Propaga o erro para o controller
  }
}

module.exports = {
  criarReserva,
  listarReservas,
  deletarReserva,
  atualizarStatusReserva,
  editarReserva,
  buscarReservasPorData
};
