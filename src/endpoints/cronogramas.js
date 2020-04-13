const database = require('../database')
const cronogramaModel = require('../models/cronogramaModel')


module.exports = async function cronogramas(request, response) {
    await database.connect()
    const cronogramas = await cronogramaModel.find()
    response.json({ cronogramas })
}