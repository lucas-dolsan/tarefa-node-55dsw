const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")
const { apiPort } = require("../config/api-config")

if(!apiPort) {
    throw new Error(`Invalid api port: ${apiPort}`)
}

let app = null

function registerEndpoints(endpoints) {
    endpoints.map(({ method, url, handler }) => {
        console.log(`${url} ${method}`)
        switch (method) {
            case "GET":
                app.get(url, handler)
                break
            case "POST":
                app.post(url, handler)
                break
            case "DELETE":
                app.delete(url, handler)
                break
            case "PUT":
                app.put(url, handler)
                break
        
        }
    })
}

async function init({endpoints, onServiceStopCallback}) {
    return new Promise((resolve, reject) => {
        try {
            app = express()
    
            app.use(cors())
            app.use(bodyParser.json())
            app.use(
                bodyParser.urlencoded({
                    extended: true,
                })
            )
            
            registerEndpoints(endpoints)

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