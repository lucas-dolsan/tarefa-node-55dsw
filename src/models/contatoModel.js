const mongoose = require('mongoose');

const contatoSchema = new mongoose.Schema({
    nome: String,
    fone: String,
    email: String,
    usuarioId: String,
  })

module.exports = mongoose.model('Contato', contatoSchema);
