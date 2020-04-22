const setorSchema = require('./setorSchema')
const authSchema = require('./authSchema')

const colaboradorSchema = {
    nome: String,
    matricula: Number,
    setor: setorSchema,
    auth: authSchema,
}

module.exports = colaboradorSchema