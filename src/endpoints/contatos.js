const Endpoint = require("../classes/endpoint")
const contatoController = require('../controllers/contatoController')

module.exports = [
    new Endpoint("/api/contatos", "POST", contatoController.create),
    new Endpoint("/api/contatos", "GET", contatoController.find),
    new Endpoint("/api/contatos/:id", "PUT", contatoController.update),
    new Endpoint("/api/contatos/:id", "GET", contatoController.findById),
]