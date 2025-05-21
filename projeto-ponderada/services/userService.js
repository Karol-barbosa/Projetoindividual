const User = require('../models/User');

async function login(email, senha) {
  const usuario = await User.buscarUsuarioPorEmail(email);

  if (!usuario) {
    throw new Error('Usuário não encontrado');
  }

  if (usuario.senha !== senha) {
    throw new Error('Senha incorreta');
  }

  return usuario;
}

module.exports = { login };
