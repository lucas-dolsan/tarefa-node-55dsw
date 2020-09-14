const CronogramaModel = require('../models/cronogramaModel')
const AtividadeModel = require('../models/atividadeModel');

const asyncForEach = async (array, callback) => {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array)
    }
}

async function getEveryCronograma(request, response) {
    const cronogramas = await CronogramaModel.find().populate('encarregado').populate('atividades')
    response.json({ cronogramas })
}

async function getOneCronograma(request, response) {
    const cronograma = await CronogramaModel.findById(request.params.id)
                                       .populate('encarregado')
                                       .populate('atividades')
                                       .lean()
    response.json({ cronograma })
}

async function createCronograma(request, response) {
    const { nome, dataInicioAgendada, atividades, descricao, dataFimAgendada } = request.body

    const createdAtividades = []
    
    await asyncForEach(atividades, async atividade => {
        const numeroItem = await AtividadeModel.countDocuments() + 1
        const atividadeDocument = await AtividadeModel({ ...atividade, numeroItem })
        await atividadeDocument.save()
        createdAtividades.push(atividadeDocument)
    })

    const cronogramaDocument = new CronogramaModel({
        nome,
        dataInicioAgendada,
        descricao,
        dataFimAgendada,
        atividades: createdAtividades,
        progresso: 0,
        iniciado: false,
        encarregado: request.user,
    })

    await cronogramaDocument.save()

    response.json({ message: 'Cronograma criado com sucesso', success: true })
}

async function startCronograma(request, response) {
    const cronograma = await CronogramaModel.findById(request.params.id)
    cronograma.iniciado = true
    await cronograma.save()
    response.json({ success: true, message: "cronograma iniciado com sucesso" })
}

async function getEveryCronogramaByEncarregado(request, response) {
    const cronogramas = await CronogramaModel.find({ "encarregado": request.user.id }).lean()
    response.json({ cronogramas })
}

module.exports = {
    createCronograma,
    getEveryCronograma,
    getOneCronograma,
    startCronograma,
    getEveryCronogramaByEncarregado,
}