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
    let cronograma = await CronogramaModel.findById(request.params.id)
                                       .populate('encarregado')
                                       .populate('atividades')
                                       .lean()
    if(cronograma.atividades) {
        cronograma.atividades = await Promise.all(cronograma.atividades.map(async atividade => {
                return await AtividadeModel.findById(atividade._id).populate("executor").lean()
        }))
    }

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

async function getEveryCronogramaFiltered(request, response) {
    const fieldsToPopulate = "encarregado atividades"
    const cronogramasEncarregado = await CronogramaModel.find({ "encarregado": request.user._id }).populate(fieldsToPopulate).lean()
    const cronogramasExecutor = (await CronogramaModel.find().populate(fieldsToPopulate).lean()).filter(({ atividades }) => {
        return atividades.some(atividade => atividade.executor === request.user._id)
    })
    let cronogramas = [...cronogramasEncarregado, ...cronogramasExecutor]
    
    cronogramas = await Promise.all(cronogramas.map(async cronograma => {
        if(cronograma.atividades) {
            cronograma.atividades = await Promise.all(cronograma.atividades.map(async atividade => {
                return await AtividadeModel.findById(atividade._id).populate("executor").lean()
            }))
        }
        return cronograma
    }))
    
    const cronogramasHashmap = {}
    // overrides repetitions
    cronogramas.map(cronograma => cronogramasHashmap[cronograma._id] = cronograma)
    
    //remaps the hashmap to an array
    response.json({ cronogramas: Object.keys(cronogramasHashmap).map(_id => cronogramasHashmap[_id]) })
}

module.exports = {
    createCronograma,
    getEveryCronograma,
    getOneCronograma,
    startCronograma,
    getEveryCronogramaFiltered,
}