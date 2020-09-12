const colaboradorModel = require('../models/colaboradorModel')

async function getEveryUser(request, response) {
    const colaboradores = await colaboradorModel.find().lean()
    response.json({ colaboradores })
}

module.exports = {
    getEveryUser,
}