const getCronogramas = require('./cronogramas')
const database = require('../database')
const cronogramaModel = require('../models/cronogramaModel')
const cronograma = require('../test_data/cronograma.json')
const colaboradorModel = require('../models/colaboradorModel')
const auth = require('./auth')

async function getUsers(request, response) {
    await database.connect()
    const users = await colaboradorModel.find()
    await database.disconnect()
    return response.json({ users })
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
        url: '/test/colaboradores',
        handler: async (request, response) => {
            await database.connect()
            const colaboradores = await colaboradorModel.find()
            response.json({ colaboradores })
        }
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
    },
    {
        url: '/authenticate',
        handler: auth.authenticate,    
        expectsBody: true
    },
    {
        url: '/register',
        handler: auth.register, 
        expectsBody: true
    },
    {
        url: '/wipe-users',
        handler: auth.wipeUsers,
    }
]

function endpointProxy(endpoint) {
    if(endpoint.expectsBody) {
        const proxiedHandler = (request, response) => {
            if (!Object.keys(request.body).length) {
                return response.sendStatus(200)
            }
            endpoint.handler(request, response)
        }
        return {...endpoint, handler: proxiedHandler}
    }

    return endpoint
}

function initializeEndpoints(app) {
    endpoints.map(endpoint => {
        const { url, handler } = endpointProxy(endpoint)
        app.use(url, handler)
    })
}

module.exports = {
    endpoints,
    initializeEndpoints,
}