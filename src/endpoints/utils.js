const database = require("../database")
const atividadeModel = require('../models/atividadeModel')
const colaboradorModel = require('../models/colaboradorModel')
const cronogramaModel = require('../models/cronogramaModel')

async function wipeDatabase(request, response) {
    await database.connect()

    await Promise.all([atividadeModel.deleteMany(), colaboradorModel.deleteMany(), cronogramaModel.deleteMany()])

    await database.disconnect()
    return response.status(200)
}

module.exports = {
    wipeDatabase
}