const Endpoint = require("../classes/endpoint")
const cronogramaController = require("../controllers/cronogramaController")

module.exports = [
    new Endpoint("/api/cronogramas", "POST", cronogramaController.createCronograma),
    new Endpoint("/api/cronogramas", "GET", cronogramaController.getEveryCronograma),
    new Endpoint("/api/cronogramas/by-encarregado", "GET", cronogramaController.getEveryCronogramaByEncarregado),
]