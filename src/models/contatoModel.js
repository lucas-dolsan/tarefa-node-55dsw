const mongoose = require('mongoose');

const contatoSchema = new mongoose.Schema({
    nome: String,
    fone: String,
    email: String,
    compromissos: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Compromisso'
    }],
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario'
    }
  })

module.exports = mongoose.model('Contato', contatoSchema);
