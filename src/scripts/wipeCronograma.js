(async () =>  {
    const databaseService = require('../services/database-service')
    const cronogramaModel = require('../models/cronogramaModel')

    await databaseService.connect()
    await cronogramaModel.deleteMany()
    await databaseService.disconnect()

})()

