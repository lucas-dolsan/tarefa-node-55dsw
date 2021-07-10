const mongoose = require('mongoose')

const usuarioSchema = new mongoose.Schema({
    nome: String,
    username: String,
    senha: String,
    auth: {
        accessToken: String,
    },
    compromissos: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Compromisso'
    }],
    contatos: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Contato'
    }],
})

module.exports = mongoose.model('Usuario', usuarioSchema)
