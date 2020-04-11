const mongoose = require('mongoose');
const cronogramaSchema = require('../schemas/cronagramaSchema')
const cronogramaSchemaInstance = new mongoose.Schema(cronogramaSchema)

module.exports = mongoose.model('cronograma', cronogramaSchemaInstance);