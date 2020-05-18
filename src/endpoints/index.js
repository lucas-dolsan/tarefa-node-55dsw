const getCronogramas = require("./cronogramas")
const database = require("../database")
const colaboradorModel = require("../models/colaboradorModel")
const auth = require("./auth")
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
    new Endpoint("/authenticate", auth.authenticate),
    new Endpoint("/register", auth.register),
    new Endpoint("/wipe-users", auth.wipeUsers, { requiresAccessToken: true }),
    new Endpoint("/cronogramas", getCronogramas, { requiresAccessToken: true }),
    new Endpoint("/atividades", getAtividades, { requiresAccessToken: true }),
    new Endpoint("/users", getUsers, { requiresAccessToken: true }),
]
function initializeEndpoints(app) {
    endpoints.map(endpoint => endpoint.initialize(app))
}

module.exports = {
    endpoints,
    initializeEndpoints,
}
