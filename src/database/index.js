//download mongodb
// https://www.mongodb.com/dr/fastdl.mongodb.org/win32/mongodb-win32-x86_64-2012plus-4.2.5-signed.msi/download

const url = "mongodb://127.0.0.1:27017/"

const mongoose = require('mongoose')
const connectArgs = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}

async function connect() {
    await mongoose.connect(url, connectArgs)
}

async function disconnect() {
    await mongoose.disconnect()
}

module.exports = {
    connect,
    disconnect
}