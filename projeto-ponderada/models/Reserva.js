const db = require('../config/database');

async function criarReserva({ usuario_id, sala_id, data_checkin, data_checkout, status = 'pendente' }) {
    console.log('[Reserva.js (Model)] Função criarReserva chamada com dados:', { usuario_id, sala_id, data_checkin, data_checkout, status });
    const query = `
      INSERT INTO reservas (usuario_id, sala_id, data_checkin, data_checkout, status)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;

    const values = [usuario_id, sala_id, data_checkin, data_checkout, status];
    console.log('[Reserva.js (Model)] Executando query:', query, 'com valores:', values);

    try {
        const result = await db.query(query, values);
        if (result.rows && result.rows.length > 0) {
            console.log('[Reserva.js (Model)] Query executada com sucesso. Resultado:', result.rows[0]);
            return result.rows[0];
        } else {
            console.error('[Reserva.js (Model)] Query não retornou linhas. Resultado:', result);
            return null; // Ou lançar um erro
        }
    } catch (error) {
        console.error('[Reserva.js (Model)] Erro ao executar query no banco de dados:', error);
        console.error('Detalhes do erro do PG:', { 
            message: error.message,
            stack: error.stack,
            code: error.code, // Código do erro do PostgreSQL (ex: '23505' para unique_violation)
            constraint: error.constraint, // Nome da constraint violada
            detail: error.detail, // Detalhes adicionais do erro
            table: error.table, // Tabela envolvida
            column: error.column // Coluna envolvida
        });
        throw error; // Propagar o erro para o service/controller tratar
    }
}

async function listarReservas() {
  const query = `SELECT * FROM reservas ORDER BY data_checkin ASC;`;
  const result = await db.query(query);
  return result.rows;
}

async function deletarReserva(id) {
  const query = `DELETE FROM reservas WHERE id = $1 RETURNING *;`;
  const result = await db.query(query, [id]);
  return result.rows[0]; 
}

async function atualizarStatusReserva(id, novoStatus) {
  const query = `
    UPDATE reservas 
    SET status = $1 
    WHERE id = $2 
    RETURNING *;
  `;
  const result = await db.query(query, [novoStatus, id]);
  return result.rows[0]; // retorna a reservas atualizada ou undefined se não existir
}

async function editarReserva(id, dados) {
  const query = `
    UPDATE reservas
    SET usuario_id = $1,
        sala_id = $2,
        data_checkin = $3,
        data_checkout = $4,
        status = $5
    WHERE id = $6
    RETURNING *;
  `;
  const valores = [
    dados.usuario_id,
    dados.sala_id,
    dados.data_checkin,
    dados.data_checkout,
    dados.status,
    id
  ];

  const result = await db.query(query, valores);
  return result.rows[0];
}

// Nova função para buscar reservas por data (ex: todas as reservas de um dia específico)
async function buscarPorData(data) {
  console.log(`[Reserva.js (Model)] Função buscarPorData chamada para data: ${data}`);
  // A data virá no formato 'YYYY-MM-DD' do controller.
  // Assumimos que data_checkin é um timestamp no banco.
  // Para comparar apenas a parte da data, podemos converter data_checkin para DATE no SQL.
  const query = `
    SELECT * 
    FROM reservas 
    WHERE DATE(data_checkin) = $1
    ORDER BY sala_id ASC, data_checkin ASC;
  `;
  // Alternativamente, se data_checkin já for do tipo DATE no banco, a conversão não é necessária.
  // Se precisar buscar dentro de um intervalo de 24h:
  // WHERE data_checkin >= $1::date AND data_checkin < ($1::date + '1 day'::interval)

  console.log('[Reserva.js (Model)] Executando query:', query, 'com valor:', [data]);
  try {
    const result = await db.query(query, [data]);
    console.log(`[Reserva.js (Model)] Query executada. ${result.rows ? result.rows.length : 0} linhas retornadas.`);
    return result.rows; // Retorna um array de reservas, pode ser vazio
  } catch (error) {
    console.error('[Reserva.js (Model)] Erro ao buscar reservas por data no banco:', error);
    throw error; // Propaga o erro
  }
}

module.exports = {
  criarReserva,
  listarReservas,
  deletarReserva,
  atualizarStatusReserva,
  editarReserva,
  buscarPorData
};

