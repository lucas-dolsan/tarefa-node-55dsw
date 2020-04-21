const colaboradorSchema = require('./colaboradorSchema')
const atividadeSchema = {
  numeroItem: Number,
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
