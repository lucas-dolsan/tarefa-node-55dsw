const database = require('../database')

const AtividadeModel = require('../models/atividadeModel')
const CronogramaModel = require('../models/cronogramaModel')

async function createAtividade(request, response) {
    const { 
        numeroItem,
        observacao,
        descricao,
        dataInicioAgendada,
        dataInicio,
        dataFimAgendada,
        dataFim,
        OS,
        AES,
        cronogramaId } = request.body

    await database.connect()

    const atividadeDocument = new AtividadeModel({
        numeroItem,
        observacao,
        descricao,
        dataInicioAgendada,
        dataInicio,
        dataFimAgendada,
        dataFim,
        OS,
        AES,
        executor: request.user
    })

    const savedAtividade = await atividadeDocument.save()

    const cronograma = await CronogramaModel.findById(cronogramaId)
    cronograma.atividades.push(savedAtividade)

    await cronograma.save()
    await database.disconnect()

    response.json({ created: savedAtividade })
}

async function setAtividadeExecutor(request, response) {
    const { atividadeId, executorId } = request.body
    await database.connect()
    const atividade = await AtividadeModel.findById(atividadeId)
    
    atividade.executor = executorId
    
    await database.disconnect()
    response.status(200)
}

module.exports = {
    createAtividade,
    setAtividadeExecutor,
}