const { createCronograma, getEveryCronograma, getEveryCronogramaByEncarregado } = require("./cronogramas")
const databaseService = require("../services/database-service")
const Endpoint = require("../classes/endpoint")

const atividadeEndpoints = require("./atividades")
const authEndpoints = require("./auth")
const cronogramaEndpoints = require("./cronogramas")
const userEndpoints = require("./users")

const wipeDatabaseEndpoint = new Endpoint(
    "/api/wipe-database",
    "GET",
    async (req, res) => {
        await databaseService.wipeDatabase()
        return res.status(200).json({ message: "database wiped" }).end();
    }, 
)

const endpoints = [
    wipeDatabaseEndpoint,
    ...atividadeEndpoints,
    ...authEndpoints,
    ...cronogramaEndpoints,
    ...userEndpoints,
]

module.exports = endpoints
