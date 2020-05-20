const mongoose = require('mongoose');

const atividadeSchema = new mongoose.Schema({
    numeroItem: Number,
    descricao: String,
    observacao: String,
    dataInicioAgendada: Date,
    dataInicio: Date,
    dataFimAgendada: Date,
    dataFim: Date,
    OS: Number,
    AES: Number,
    executor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Colaborador'
    }
  })

module.exports = mongoose.model('Atividade', atividadeSchema);