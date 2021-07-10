const databaseService = require("../services/database-service")
const Endpoint = require("../classes/endpoint")

const contatos = require("./contatos.js")
const auth = require("./auth.js")
const compromissos = require("./compromissos.js")
const usuarios = require("./usuarios.js")

const endpoints = [
    ...contatos,
    ...auth,
    ...compromissos,
    ...usuarios,
]

module.exports = endpoints
