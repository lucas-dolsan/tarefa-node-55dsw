const colaboradorSchema = require('./colaboradorSchema')
const atividadeSchema = {
    descricao: String,
    observacao: String,
    dataInicioAgendada: Date,
    dataInicio: Date,
    dataFimAgendada: Date,
    dataFim: Date,
    OS: Number,
    AES: Number,
    executor: colaboradorSchema
}

module.exports = atividadeSchema