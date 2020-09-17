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
    console.log(request.body);
    //finds the current atividade and updates it's new progress supplied in the request's body
    const atividade = await AtividadeModel.findById(atividadeId)
    // if atividade didn't have progresso set before, it means it has just been started
    if(!atividade.progresso) {
        atividade.dataInicio = new Date()
    }
    atividade.progresso = progresso
    // if progresso is set to 100, atividade is done
    if(atividade.progresso === 100) {
        atividade.dataFim = new Date()
    }
    await atividade.save()
    // gets every cronograma and parses it to json
    const cronogramas = await CronogramaModel.find().lean()
    // finds the cronograma which has the current atividade, and returns it's id
    const cronogramaId = cronogramas.find(({ atividades }) => atividades.map(({ _id }) => _id.toString()).includes(atividadeId))._id
    // gets the mongoose doc that corresponds the id
    const cronograma = await CronogramaModel.findById(cronogramaId).populate('atividades')
   // if cronograma didn't have progress set before, it means it has just been started
    if(!cronograma.progresso) {
        cronograma.dataInicio = new Date()
    }
    //sums up the total progress of the cronograma's atividades
    const totalProgresso = cronograma.atividades.reduce((acc, atividade) => {
        return acc + ( atividade.progresso || 0)
    }, 0)
    // sets the updated progress
    cronograma.progresso = totalProgresso / cronograma.atividades.length
    // if progresso is set to 100, cronograma is done
    if(cronograma.progresso === 100) {
        cronograma.dataFim = new Date()
    }
    await cronograma.save()

    response.json({success: true, message: 'progresso da ativdade atualizado com sucesso!'})
}

module.exports = {
    createAtividade,
    setAtividadeExecutor,
    getEveryAtividade,
    setProgresso,
}