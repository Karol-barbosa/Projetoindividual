const db = require('../config/database');

async function criarReserva({ usuario_id, sala_id, data_checkin, data_checkout, status = 'pendente' }) {
  const query = `
    INSERT INTO reservas (usuario_id, sala_id, data_checkin, data_checkout, status)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;
  `;

  const values = [usuario_id, sala_id, data_checkin, data_checkout, status];

  const result = await db.query(query, values);
  return result.rows[0];
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
  return result.rows[0]; // retorna a reserva atualizada ou undefined se não existir
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

module.exports = {
  criarReserva,
  listarReservas,
  deletarReserva,
  atualizarStatusReserva,
  editarReserva
};

