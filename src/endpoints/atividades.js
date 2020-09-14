const Endpoint = require("../classes/endpoint")
const atividadeController = require('../controllers/atividadeController')

module.exports = [
    new Endpoint("/api/atividades", "POST", atividadeController.createAtividade),
    new Endpoint("/api/atividades/set-progresso", "POST", atividadeController.setProgresso),
    new Endpoint("/api/atividades/set-executor", "POST", atividadeController.setAtividadeExecutor),
    new Endpoint("/api/atividades", "GET", atividadeController.getEveryAtividade),
]