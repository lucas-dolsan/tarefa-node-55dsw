const auth = require("./auth")
class Endpoint {
    constructor(url, handler, props = {}) {
        if (!url) {
            throw new Error("Endpoint: Invalid url")
        }
        if (!handler) {
            throw new Error("Endpoint: Invalid handler")
        }
        this.url = url
        this.handler = handler
        this.requiresAccessToken = !!props.requiresAccessToken
    }

    initialize(app) {
        const { url, handler } = auth.proxyEndpoint(this)
        app.use(url, handler)
    }
}

module.exports = Endpoint
