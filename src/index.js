require('dotenv').config()

const apiService = require('./services/api-service')
const databaseService = require('./services/database-service')
const endpoints = require("./endpoints")

async function init() {
    await databaseService.connect()
    await apiService.init({ endpoints, onServiceStopCallback: databaseService.disconnect })
}
init()