const setorSchema = require('./setorSchema')
const colaboradorSchema = {
    tipo: String,
    nome: String,
    matricula: Number,
    setor: setorSchema
}

module.exports = colaboradorSchema