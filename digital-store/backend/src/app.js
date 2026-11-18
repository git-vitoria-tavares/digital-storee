require('dotenv').config({ quiet: true });

const express = require('express');
const cors = require('cors');
const routes = require('./routes');

const app = express();

app.use(cors()); // permite que o front (outra porta) acesse a API
app.use(express.json({ limit: '20mb' })); // lê JSON do corpo (limite maior por causa das imagens em base64)
app.use('/media', express.static('public/media')); // serve as imagens dos produtos

app.use('/v1', routes);

// Erros não tratados (ex.: JSON inválido = 400, falha no banco = 500)
app.use((error, req, res, next) => {
  if (!error.status) console.error(error);
  res.status(error.status || 500).json({ message: error.message });
});

module.exports = app;
