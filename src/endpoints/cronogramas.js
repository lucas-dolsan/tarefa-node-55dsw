const database = require('../database')
const CronogramaModel = require('../models/cronogramaModel')

async function getEveryCronograma(request, response) {
    await database.connect()
    const cronogramas = await CronogramaModel.find()
    await database.disconnect()
    response.json({ cronogramas })
}

async function createCronograma(request, response) {
    const { nome, dataInicioAgendada, dataInicio, dataFimAgendada, dataFim } = request.body

    await database.connect()

    const cronogramaDocument = new CronogramaModel({
        nome,
        dataInicioAgendada,
        dataInicio,
        dataFimAgendada,
        dataFim,
        atividades: [],
        encarregado: request.user,
    })

    await cronogramaDocument.save()

    await database.disconnect()

    response.json({ created: cronogramaDocument })
}


async function getEveryCronogramaByEncarregado(request, response) {
    await database.connect()
    const cronogramas = await CronogramaModel.find({ "encarregado": request.user.id })
    await database.disconnect()
    response.json({ cronogramas })
}

module.exports = {
    createCronograma,
    getEveryCronograma,
    getEveryCronogramaByEncarregado,
}