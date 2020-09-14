const AtividadeModel = require('../models/atividadeModel')
const CronogramaModel = require('../models/cronogramaModel')

async function getEveryAtividade(request, response) {
    const atividades = await AtividadeModel.find().lean()
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
        progresso: 0,
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
    await atividade.save()
    
    response.status(200)
}

async function setProgresso(request, response) {
    const { atividadeId, progresso } = request.body
    //finds the current atividade and updates it's new progress supplied in the request's body
    const atividade = await AtividadeModel.findById(atividadeId)
    atividade.progresso = progresso
    await atividade.save()
    // gets every cronograma and parses it to json
    const cronogramas = await CronogramaModel.find().lean()
    // finds the cronograma which has the current atividade, and returns it's id
    const cronogramaId = cronogramas.find(({ atividades }) => atividades.map(({ _id }) => _id.toString()).includes(atividadeId))._id
    // gets the mongoose doc that corresponds the id
    const cronograma = await CronogramaModel.findById(cronogramaId).populate('atividades')
    //sums up the total progress of the cronograma's atividades
    const totalProgresso = cronograma.atividades.reduce((acc, atividade) => {
        return acc + ( atividade.progresso || 0)
    }, 0)
    // sets the updated progress
    cronograma.progresso = totalProgresso / cronograma.atividades.length
    await cronograma.save()

    response.json({success: true, message: 'progresso da ativdade atualizado com sucesso!'})
}

module.exports = {
    createAtividade,
    setAtividadeExecutor,
    getEveryAtividade,
    setProgresso,
}