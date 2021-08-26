const express = require("express")
const cors = require("cors")
const { apiPort } = require("../config/api-config")

if(!apiPort) {
    throw new Error(`Invalid api port: ${apiPort}`)
}

let app = null

async function init({endpoints, onServiceStopCallback}) {
    return new Promise((resolve, reject) => {
        try {
            app = express()
            app.use(cors())
            app.use(express.json())

            endpoints.map(endpoint => endpoint.init(app))

            app.listen(apiPort, async () => { 
                console.log("Server listening on port: " + apiPort)
            })

            process.on("SIGTERM", () => {
                console.log("Stopping server...");
                server.close(async () => {
                    if(onServiceStopCallback)
                        await onServiceStopCallback()
                    console.log("Server stopped");
                });
            });
            return resolve()    
        } catch (error) {
            return reject(error)
        }
    })
}


module.exports = {
    init
}