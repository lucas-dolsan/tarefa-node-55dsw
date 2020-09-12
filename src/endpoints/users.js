const Endpoint = require("../classes/endpoint")
const userController = require('../controllers/userController')

module.exports = [
    new Endpoint("/api/users", "GET", userController.getEveryUser, { requiresAccessToken: true }),
]