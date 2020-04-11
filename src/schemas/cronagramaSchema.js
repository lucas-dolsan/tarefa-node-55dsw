const colaboradorSchema = require("./colaboradorSchema")

const atividadeSchema = require("./atividadeSchema")

const cronogramaSchema = {
    dataInicioAgendada: Date,
    dataInicio: Date,
    dataFimAgendada: Date,
    dataFim: Date,
    atividades: [atividadeSchema],
    encarregado: colaboradorSchema,
}

module.exports = cronogramaSchema