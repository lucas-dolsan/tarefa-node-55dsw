const getCronogramas = require('./cronogramas')
const database = require('../database')
const cronogramaModel = require('../models/cronogramaModel')
const cronograma = require('../test_data/cronograma.json')

function getUsers(request, response) {
    response.sendStatus(404)
}

function getAtividades(request, response) {
    response.sendStatus(404)
}

const endpoints = [{
        url: '/cronogramas',
        handler: getCronogramas
    },
    {
        url: '/test/cronogramas',
        handler: getCronogramas
    },
    {
        url: '/test/delete-cronogramas',
        //temporário, só pra mostrar que da pra fazer
        handler: async (request, response) => {
            database.connect()
            const deleted = await cronogramaModel.deleteMany()
            database.disconnect()
            response.sendStatus(200)
        }
    },
    {
        url: '/test/create-cronograma',
        //temporário, só pra mostrar que da pra fazer
        handler: async (request, response) => {
            database.connect()
            const cronogramaDoc =  new cronogramaModel(cronograma)
            await cronogramaDoc.save()

            database.disconnect()
            response.sendStatus(201)

        }
    },
    {
        url: '/users',
        handler: getUsers
    },
    {
        url: '/atividades',
        handler: getAtividades
    }
]

function initializeEndpoints(app) {
    endpoints.map(({ url, handler }) => app.use(url, handler))
}

module.exports = {
    endpoints,
    initializeEndpoints,
}