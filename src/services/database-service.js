const mongoose = require('mongoose')

const { hostname, defaultConnectionArgs } = require('../config/database-config');
const atividadeModel = require('../models/atividadeModel');
const colaboradorModel = require('../models/colaboradorModel');
const cronogramaModel = require('../models/cronogramaModel');

async function connect() {
    console.log(`connecting to database... @${hostname}`);
    await mongoose.connect(hostname, defaultConnectionArgs)
    console.log(`succesfully connected to database`);
}

async function wipeDatabase() {
    await Promise.all([atividadeModel.deleteMany(), colaboradorModel.deleteMany(), cronogramaModel.deleteMany()])
}

async function disconnect() {
    console.log("disconnecting from database...");
    await mongoose.disconnect()
    console.log(`succesfully disconnected from database`);
}

module.exports = {
    connect,
    disconnect,
    wipeDatabase,
}

 