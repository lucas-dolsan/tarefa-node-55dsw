const mongoose = require('mongoose');

const compromissoSchema = new mongoose.Schema({
    nome: String,
    descricao: String,
    local: String,
    data: Date,
    usuarioId: String,
    contatoId: String,
})

module.exports = mongoose.model('Compromisso', compromissoSchema);
