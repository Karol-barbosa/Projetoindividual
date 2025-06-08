const Reserva = require('../models/Reserva');

function construirDatasCheckinCheckout(horarioInicio) {
    const hoje = new Date();
    const [hora, minuto] = horarioInicio.split(':').map(Number);
  
    const dataCheckin = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate(), hora, minuto);
    const dataCheckout = new Date(dataCheckin.getTime() + 60 * 60 * 1000); // Adiciona 1 hora em milissegundos
  
    return { dataCheckin, dataCheckout };
}

async function criarReserva({ usuario_id, sala_id, horario_inicio, status }) {
    console.log('[reservaService.js] Função criarReserva chamada com dados:', { usuario_id, sala_id, horario_inicio, status });
    
    // Constrói as datas de check-in e check-out completas
    const { dataCheckin, dataCheckout } = construirDatasCheckinCheckout(horario_inicio);

    // Converte para o formato que o driver do PostgreSQL (pg) entende bem (ISO 8601)
    const dadosParaModelo = {
        usuario_id,
        sala_id,
        data_checkin: dataCheckin.toISOString(),
        data_checkout: dataCheckout.toISOString(),
        status
    };

    try {
        console.log('[reservaService.js] Chamando Reserva.criarReserva (Model) com dados:', dadosParaModelo);
        const reservaCriada = await Reserva.criarReserva(dadosParaModelo);
        
        console.log('[reservaService.js] Reserva criada pelo modelo:', reservaCriada);
        return reservaCriada;
    } catch (error) {
        console.error('[reservaService.js] Erro ao tentar criar reserva no serviço:', error);
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
