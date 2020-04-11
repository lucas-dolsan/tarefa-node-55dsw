(async () =>  {
    const database = require('../database')
    const cronogramaModel = require('../models/cronogramaModel')

    database.connect()

    await cronogramaModel.deleteMany()

    database.disconnect()

})()

