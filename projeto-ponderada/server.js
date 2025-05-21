const express = require('express');
const app = express();
const routes = require('./routes/index');
require('dotenv').config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public')); // ou 'assets' se você quiser servir arquivos estáticos

app.use('/', routes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
