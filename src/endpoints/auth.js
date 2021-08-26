const Endpoint = require("../classes/endpoint")
const authService = require("../services/auth-service")

module.exports = [
    new Endpoint("/api/auth/login", "POST", authService.login, { requiresAccessToken: false }),
    new Endpoint("/api/auth/register", "POST", authService.register, { requiresAccessToken: false }),
    new Endpoint("/api/auth/validate-token", "POST", authService.validateAccessToken, { requiresAccessToken: false }),
]