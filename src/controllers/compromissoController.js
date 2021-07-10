const CompromissoModel = require('../models/compromissoModel.js')

async function findAll(request, response) {
    const compromissos = await CompromissoModel.find()
    response.json(compromissos)
}

async function findById(request, response) {
    const compromisso = await CompromissoModel.findById(request.params.id).lean()

    response.json(compromisso)
}

async function create(request, response) {
    
    const compromissoDoc = new CompromissoModel(request.body)

    await compromissoDoc.save()

    response.json(compromissoDoc)
}

async function find(request, response) {
    const compromissos = await CompromissoModel.find(request.params).lean()
    response.json(compromissos)    
}

module.exports = {
    create,
    findAll,
    findById,
    find,
}
