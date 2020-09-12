const authService = require("../services/auth-service")
class Endpoint {
    constructor(url, method, handler, props = {}) {
        const validMethods = ["GET", "POST", "DELETE", "PUT"]
        if(!method || typeof method !== "string" || validMethods.every(validMethod => method !== validMethod)) {
            throw new Error(`Endpoint: Invalid method for url:${url}`)
        }
        if (!url) {
            throw new Error("Endpoint: Invalid url")
        }
        if (!handler) {
            throw new Error("Endpoint: Invalid handler")
        }
        this.url = url
        this.handler = handler
        this.method = method
        this.requiresAccessToken = !!props.requiresAccessToken
    }

    init(app) {
        const { url, handler, method } = authService.proxyEndpoint(this)

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
    }
}

module.exports = Endpoint
