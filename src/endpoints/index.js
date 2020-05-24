const { createCronograma, getEveryCronograma, getEveryCronogramaByEncarregado } = require("./cronogramas")
const database = require("../database")
const colaboradorModel = require("../models/colaboradorModel")
const auth = require("./auth")
const utils = require("./utils")
const Endpoint = require("./endpoint")

async function getUsers(request, response) {
    await database.connect()
    const users = await colaboradorModel.find()
    await database.disconnect()
    return response.json({ users })
}

function getAtividades(request, response) {
    response.sendStatus(404)
}

const endpoints = [
    new Endpoint("/api/authenticate", auth.authenticate),
    new Endpoint("/api/register", auth.register),
    new Endpoint("/api/wipe-database", utils.wipeDatabase, { requiresAccessToken: false }),
    new Endpoint("/api/cronogramas", getEveryCronograma, { requiresAccessToken: false }),
    new Endpoint("/api/create/cronograma", createCronograma, { requiresAccessToken: true }),
    new Endpoint("/api/atividades", getAtividades, { requiresAccessToken: true }),
    new Endpoint("/api/users", getUsers, { requiresAccessToken: true }),
]
function initializeEndpoints(app) {
    endpoints.map(endpoint => endpoint.initialize(app))
}

module.exports = {
    endpoints,
    initializeEndpoints,
}
