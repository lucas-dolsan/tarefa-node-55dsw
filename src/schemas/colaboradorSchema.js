const setorSchema = require('./setorSchema')
const colaboradorSchema = {
    nome: String,
    matricula: Number,
    setor: setorSchema
}

module.exports = colaboradorSchema