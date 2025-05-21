const userService = require('../services/userService');

async function login(req, res) {
  const { email, senha } = req.body;

  try {
    const usuario = await userService.login(email, senha);
    res.send(`Bem-vindo, ${usuario.email}!`);
  } catch (error) {
    res.status(401).send(error.message);
  }
}

module.exports = { login };
