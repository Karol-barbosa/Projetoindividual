const db = require('../config/database');

async function buscarUsuarioPorEmail(email) {
  const query = 'SELECT * FROM usuario WHERE email = $1';
  const values = [email];

  const result = await db.query(query, values);
  return result.rows[0];
}

module.exports = { buscarUsuarioPorEmail };
