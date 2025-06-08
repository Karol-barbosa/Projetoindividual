const reservaService = require('../services/reservaService'); // ajuste o caminho se necessário

exports.renderizarLista = (req, res) => {
 
  console.log('[ReservaController.js] Renderizando views/reservas/index (renderizarLista)');
  res.render('reservas/index', { titulo: 'Lista de Reservas' }); 
};

exports.renderizarFormulario = (req, res) => {
  // Renderiza formulário para criar reserva
  console.log('[ReservaController.js] Renderizando views/reservas/form (renderizarFormulario)');
  res.render('reservas/form', { titulo: 'Nova Reserva' }); 
};

exports.criar = async (req, res) => {
  console.log('[ReservaController.js] POST /api/reservas (criar)');
  
  // O ID do usuário vem da sessão, não do corpo da requisição
  const usuario_id = req.session.userId;
  const { sala_id, horario_inicio } = req.body; // Esperamos sala_id e horario_inicio

  console.log('[ReservaController.js] Corpo da requisição (req.body):', req.body);
  console.log('[ReservaController.js] ID do usuário da sessão:', usuario_id);

  if (!usuario_id || !sala_id || !horario_inicio) {
    console.error('[ReservaController.js] Dados inválidos ou ausentes:', { usuario_id, sala_id, horario_inicio });
    return res.status(400).json({
      erro: 'Dados inválidos ou ausentes',
      detalhes: 'É necessário estar logado e fornecer sala_id e horario_inicio.'
    });
  }

  try {
    const dadosReserva = {
      usuario_id,
      sala_id,
      horario_inicio,
      status: 'confirmada' // Status padrão
    };

    console.log('[ReservaController.js] Chamando reservaService.criarReserva com dados:', dadosReserva);
    const novaReserva = await reservaService.criarReserva(dadosReserva);
    
    console.log('[ReservaController.js] Reserva criada com sucesso pelo serviço:', novaReserva);
    res.status(201).json(novaReserva);
  } catch (error) {
    console.error('[ReservaController.js] Erro ao tentar criar reserva:', error.message);
    // Verificar se o erro é de sobreposição (pode ser customizado no service)
    if (error.message.includes('sobreposição') || (error.code === '23P01')) { // 23P01 é exclusion_violation no PostgreSQL
        return res.status(409).json({ erro: 'Conflito de reserva', detalhes: 'Este horário para esta sala já está reservado.' });
    }
    res.status(500).json({ erro: 'Erro interno do servidor ao criar reserva', detalhes: error.message });
  }
};

exports.listar = (req, res) => {
  console.log('[ReservaController.js] Rota GET /api/reservas (listar) acessada - em desenvolvimento.');
  res.json({ mensagem: "Listar reservas - em desenvolvimento" });
};

exports.deletar = (req, res) => {
  console.log(`[ReservaController.js] Rota DELETE /api/reserva/${req.params.id} (deletar) acessada - em desenvolvimento.`);
  res.json({ mensagem: `Deletar reserva de id ${req.params.id} - em desenvolvimento` });
};

exports.atualizarStatus = (req, res) => {
  console.log(`[ReservaController.js] Rota PATCH /api/reserva/${req.params.id}/status (atualizarStatus) acessada - em desenvolvimento.`);
  res.json({ mensagem: `Atualizar status da reserva de id ${req.params.id} - em desenvolvimento` });
};

exports.editar = (req, res) => {
  console.log(`[ReservaController.js] Rota PUT /api/reserva/${req.params.id} (editar) acessada - em desenvolvimento.`);
  res.json({ mensagem: `Editar reserva de id ${req.params.id} - em desenvolvimento` });
};

// Nova função para listar reservas de hoje
exports.listarReservasDeHoje = async (req, res) => {
  console.log('[ReservaController.js] GET /api/reservas/hoje (listarReservasDeHoje)');
  try {
    const hoje = new Date();
    // Formatar a data para YYYY-MM-DD para correspondência no banco, 
    // dependendo de como as datas são armazenadas e como o serviço/modelo espera.
    // O JavaScript toISOString() retorna algo como "2024-07-15T10:20:30.000Z".
    // Precisamos apenas da parte da data.
    const ano = hoje.getFullYear();
    const mes = (hoje.getMonth() + 1).toString().padStart(2, '0'); // getMonth() é 0-indexado
    const dia = hoje.getDate().toString().padStart(2, '0');
    const dataFormatada = `${ano}-${mes}-${dia}`;

    console.log(`[ReservaController.js] Buscando reservas para a data: ${dataFormatada}`);

    // Chamaremos uma função no serviço, que por sua vez chamará o modelo
    const reservasDeHoje = await reservaService.buscarReservasPorData(dataFormatada);

    if (!reservasDeHoje) {
      // Isso pode significar que o serviço retornou undefined ou houve um erro não capturado lá
      console.warn('[ReservaController.js] reservaService.buscarReservasPorData retornou falsy');
      return res.status(404).json({ mensagem: 'Nenhuma reserva encontrada para hoje ou erro no serviço.' });
    }

    console.log(`[ReservaController.js] Reservas encontradas para hoje: ${reservasDeHoje.length}`);
    res.status(200).json(reservasDeHoje);

  } catch (error) {
    console.error('[ReservaController.js] Erro ao buscar reservas de hoje:', error);
    res.status(500).json({ erro: 'Erro interno do servidor ao buscar reservas de hoje', detalhes: error.message });
  }
};

