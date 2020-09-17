const Endpoint = require("../classes/endpoint")
const cronogramaController = require("../controllers/cronogramaController")

module.exports = [
    new Endpoint("/api/cronogramas", "POST", cronogramaController.createCronograma, { requiresAccessToken: true }),
    new Endpoint("/api/cronogramas", "GET", cronogramaController.getEveryCronograma, { requiresAccessToken: true }),
    new Endpoint("/api/cronogramas/filtered", "GET", cronogramaController.getEveryCronogramaFiltered, { requiresAccessToken: true }),
    new Endpoint("/api/cronogramas/:id", "GET", cronogramaController.getOneCronograma, { requiresAccessToken: true }),
    new Endpoint("/api/cronogramas/:id/start", "GET", cronogramaController.startCronograma, { requiresAccessToken: true }),
]