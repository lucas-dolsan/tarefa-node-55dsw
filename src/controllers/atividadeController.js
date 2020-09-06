const AtividadeModel = require('../models/atividadeModel')
const CronogramaModel = require('../models/cronogramaModel')

async function getEveryAtividade(request, response) {
    const atividades = await AtividadeModel.find()
    response.json({ atividades })
}

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
    
    response.json({ created: savedAtividade })
}

async function setAtividadeExecutor(request, response) {
    const { atividadeId, executorId } = request.body
    
    const atividade = await AtividadeModel.findById(atividadeId)
    
    atividade.executor = executorId
    
    
    response.status(200)
}

module.exports = {
    createAtividade,
    setAtividadeExecutor,
    getEveryAtividade,
}