const mongoose = require('mongoose')

const colaboradorSchema = new mongoose.Schema({
    nome: String,
    matricula: Number,
    setor: {
        tipo: String,
    },
    auth: {
        login: String,
        password: String,
        accessToken: String,
    },
})

module.exports = mongoose.model('Colaborador', colaboradorSchema)