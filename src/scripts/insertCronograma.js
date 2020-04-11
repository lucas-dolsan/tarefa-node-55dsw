(async () =>  {
    const database = require('../database')
    const cronogramaModel = require('../models/cronogramaModel')
    const cronograma = require('../test_data/cronograma.json')

    database.connect()
    const cronogramaDoc =  new cronogramaModel(cronograma)
    await cronogramaDoc.save()

    database.disconnect()

})()

