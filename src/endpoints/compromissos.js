const Endpoint = require("../classes/endpoint")
const compromissoController = require("../controllers/compromissoController.js")

module.exports = [
    new Endpoint("/api/compromissos", "POST", compromissoController.create, { requiresAccessToken: false }),
    new Endpoint("/api/compromissos", "GET", compromissoController.findAll, { requiresAccessToken: false }),
    new Endpoint("/api/compromissos/:id", "GET", compromissoController.findById, { requiresAccessToken: false }),
]

