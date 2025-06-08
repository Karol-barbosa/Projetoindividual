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
  console.log('[ReservaController.js] Requisição recebida em POST /api/reserva (criar)');
  console.log('[ReservaController.js] Corpo da requisição (req.body):', req.body);

  const { usuario_id, sala_id, data_checkin, data_checkout, status } = req.body;

  if (usuario_id === undefined || sala_id === undefined || !data_checkin || !data_checkout || !status) {
    console.error('[ReservaController.js] Dados inválidos ou ausentes na requisição para criar:', req.body);
    return res.status(400).json({
      erro: 'Dados inválidos ou ausentes',
      detalhes: 'Campos obrigatórios: usuario_id, sala_id, data_checkin, data_checkout, status'
    });
  }

  const checkinDate = new Date(data_checkin);
  const checkoutDate = new Date(data_checkout);

  if (checkoutDate < checkinDate) {
    console.error('[ReservaController.js] Data de checkout anterior à data de checkin');
    return res.status(400).json({
      erro: 'Data inválida',
      detalhes: 'A data de checkout não pode ser anterior à data de checkin.'
    });
  }

  try {
    console.log('[ReservaController.js] Chamando reservaService.criarReserva com os dados:', { usuario_id, sala_id, data_checkin, data_checkout, status });
    const novaReserva = await reservaService.criarReserva({
      usuario_id: parseInt(usuario_id),
      sala_id: parseInt(sala_id),
      data_checkin,
      data_checkout,
      status
    });

    if (!novaReserva) {
      console.error('[ReservaController.js] reservaService.criarReserva retornou null ou undefined');
      return res.status(500).json({ erro: 'Erro ao criar reserva no serviço', detalhes: 'O serviço não retornou uma reserva criada.' });
    }

    console.log('[ReservaController.js] Reserva criada com sucesso pelo serviço:', novaReserva);
    res.status(201).json(novaReserva);
  } catch (error) {
    console.error('[ReservaController.js] Erro ao tentar criar reserva:', error);
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

