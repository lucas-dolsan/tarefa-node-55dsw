const usuarioModel = require('../models/usuarioModel.js')

async function findAll(request, response) {
    const usuarios = await usuarioModel.find().lean()
    response.json(usuarios)
}

module.exports = {
    findAll,
}
