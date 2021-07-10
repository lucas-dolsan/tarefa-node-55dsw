const mongoose = require('mongoose');

const compromissoSchema = new mongoose.Schema({
    nome: String,
    descricao: String,
    local: String,
    data: Date,
})

module.exports = mongoose.model('Compromisso', compromissoSchema);
