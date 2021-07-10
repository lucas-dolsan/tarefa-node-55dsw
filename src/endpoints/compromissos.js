const Endpoint = require("../classes/endpoint")
const compromissoController = require("../controllers/compromissoController.js")

module.exports = [
    new Endpoint("/api/compromissos", "POST", compromissoController.create, { requiresAccessToken: false }),
    new Endpoint("/api/compromissos", "GET", compromissoController.find, { requiresAccessToken: false }),
    new Endpoint("/api/compromissos/:id", "GET", compromissoController.findById, { requiresAccessToken: false }),
    new Endpoint("/api/compromissos/:id", "PUT", compromissoController.update, { requiresAccessToken: false }),
    new Endpoint("/api/compromissos/:id", "DELETE", compromissoController.deleteById, { requiresAccessToken: false }),
]

