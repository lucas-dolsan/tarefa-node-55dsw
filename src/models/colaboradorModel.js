const mongoose = require('mongoose');
const colaboradorSchema = require('../schemas/colaboradorSchema')
const colaboradorSchemaInstance = new mongoose.Schema(colaboradorSchema)

module.exports = mongoose.model('colaborador', colaboradorSchemaInstance);