const CompromissoModel = require('../models/compromissoModel.js')

async function find(request, response) {
    const data = {}
    if(request.query.dataInicio) {
        data["$gte"] = new Date(request.query.dataInicio)
        delete request.query.dataInicio
    }
    if(request.query.dataFim) {
        data["$lt"] = new Date(request.query.dataFim)
        delete request.query.dataFim
    }

    const args = { ...request.query }

    if(Object.keys(data).length > 0) {
        args.data = data
    }

    const compromissos = await CompromissoModel.find(args)
    response.json(compromissos)
}

async function findById(request, response) {
    const compromisso = await CompromissoModel.findById(request.params.id).lean()
    response.json(compromisso)
}

async function create(request, response) {
    const compromisso = new CompromissoModel({
        ...request.body,
        usuarioId: request.user._id
    })
    await compromisso.save()
    response.json(compromisso)
}

async function update(request, response) {
    await CompromissoModel.findOneAndUpdate(
         {"_id": request.params.id}, 
         request.body,
     )
    const compromisso = await CompromissoModel.findById(request.params.id)
    response.json(compromisso)
}

async function deleteById(request, response) {
    await CompromissoModel.findByIdAndRemove(request.params.id)
    response.sendStatus(200)
}

module.exports = {
    create,
    findById,
    find,
    update,
    deleteById,
}