const Endpoint = require("../classes/endpoint")
const contatoController = require('../controllers/contatoController')

module.exports = [
    new Endpoint("/api/contatos", "POST", contatoController.create),
    new Endpoint("/api/contatos", "GET", contatoController.findAll),
]

