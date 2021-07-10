const ContatoModel = require('../models/contatoModel.js')

async function findAll(request, response) {
    const contatos = await ContatoModel.find().lean()
    response.json(contatos)
}

async function create(request, response) {

    const contatoDoc = new AtividadeModel(request.body)

    const contato = await contatoDoc.save()

    response.json(contato)
}

module.exports = {
    findAll,
    create,
}
