const CronogramaModel = require('../models/cronogramaModel')
const AtividadeModel = require('../models/atividadeModel')

async function getEveryCronograma(request, response) {
    const cronogramas = await CronogramaModel.find().populate('encarregado').populate('atividades')
    response.json({ cronogramas })
}

async function createCronograma(request, response) {
    const { nome, dataInicioAgendada, atividades, descricao, dataInicio, dataFimAgendada, dataFim } = request.body

    const createdAtividades = await Promise.all(atividades.map(async atividade => {
        const atividadeDocument = await AtividadeModel(atividade)
        atividadeDocument.save()
        return atividadeDocument
    }))

    const cronogramaDocument = new CronogramaModel({
        nome,
        dataInicioAgendada,
        descricao,
        dataInicio,
        dataFimAgendada,
        dataFim,
        atividades: createdAtividades,
        encarregado: request.user,
    })

    await cronogramaDocument.save()

    response.json({ message: 'Cronograma criado com sucesso', success: true })
}

async function getEveryCronogramaByEncarregado(request, response) {
    const cronogramas = await CronogramaModel.find({ "encarregado": request.user.id })
    
    response.json({ cronogramas })
}

module.exports = {
    createCronograma,
    getEveryCronograma,
    getEveryCronogramaByEncarregado,
}