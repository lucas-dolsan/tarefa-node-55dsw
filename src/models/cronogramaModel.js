const mongoose = require('mongoose');

const cronogramaSchema = new mongoose.Schema({
    nome: String,
    dataInicioAgendada: Date,
    dataInicio: Date,
    dataFimAgendada: Date,
    dataFim: Date,
    atividades: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Atividade'
    }],
    encarregado: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Colaborador'
    },
    executores: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Colaborador'
    }]
  })

module.exports = mongoose.model('Cronograma', cronogramaSchema);