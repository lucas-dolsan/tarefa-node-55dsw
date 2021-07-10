const ContatoModel = require('../models/contatoModel.js')

async function find(request, response) {
    const contatos = await ContatoModel.find(request.query).lean()
    response.json(contatos)
}

async function findById(request, response) {
    const contato = await ContatoModel.findById(request.params.id)
    response.json(contato)
}

async function create(request, response) {
    const contatoDoc = new ContatoModel(request.body)
    const contato = await contatoDoc.save()
    response.json(contato)
}

async function update(request, response) {
   await ContatoModel.findOneAndUpdate(
        {"_id": request.params.id}, 
        request.body,
    )
    const contato = await ContatoModel.findById(request.params.id)
    response.json(contato)
}

module.exports = {
    find,
    create,
    update,
    findById,
}
