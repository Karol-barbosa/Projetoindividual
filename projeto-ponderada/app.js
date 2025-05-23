const express = require('express');
const app = express();
const usuarioRoutes = require('./routes/index');
// Middleware para ler JSON no corpo da requisição
app.use(express.json());
// Rotas da API com prefixo /api
app.use('/api', usuarioRoutes);
// Inicialização do servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}, localhost:${PORT}`);
});