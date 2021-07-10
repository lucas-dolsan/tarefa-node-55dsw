const Endpoint = require("../classes/endpoint")
const usuarioController = require('../controllers/usuarioController')

module.exports = [
    new Endpoint("/api/usuarios", "GET", usuarioController.findAll, { requiresAccessToken: false }),
]
