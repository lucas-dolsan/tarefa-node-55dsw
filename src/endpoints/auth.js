const Endpoint = require("../classes/endpoint")
const authService = require("../services/auth-service")

module.exports = [
    new Endpoint("/api/auth/authenticate", "POST", authService.authenticate),
    new Endpoint("/api/auth/register", "POST", authService.register),
]