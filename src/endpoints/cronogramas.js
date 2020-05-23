const database = require('../database')
const CronogramaModel = require('../models/cronogramaModel')

async function getEveryCronograma(request, response) {
    await database.connect()
    const cronogramas = await CronogramaModel.find().populate('encarregado')

    await database.disconnect()
    response.json({ cronogramas })
}

async function createCronograma(request, response) {
    const { nome, dataInicioAgendada, descricao, dataInicio, dataFimAgendada, dataFim } = request.body

    await database.connect()

    const cronogramaDocument = new CronogramaModel({
        nome,
        dataInicioAgendada,
        descricao,
        dataInicio,
        dataFimAgendada,
        dataFim,
        atividades: [],
        encarregado: request.user,
    })

    await cronogramaDocument.save()

    await database.disconnect()

    response.json({ message: 'Cronograma criado com sucesso', success: true })
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