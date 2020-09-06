(async () =>  {
    const databaseService = require("../services/database-service")
    const cronogramaModel = require('../models/cronogramaModel')
    const cronograma = require('../test_data/cronograma.json')

    await databaseService.connect()
    await new cronogramaModel(cronograma).save()
    await databaseService.disconnect()

})()

