const database = require("../database")
const sha256 = require("sha256")
const util = require("util")
const colaboradorModel = require("../models/colaboradorModel")

//todo: isolar constantes, os tokens acho melhor num .env por exemplo
const TOKEN_HASH_SALT =
    "17291fbce8b01cd2331ce6afeea4d3b26ea5c8b8d3d327a3603ad9ba35cf7c70b5fccc8872ff910f4cfd5314686f5804adcad5fdc8f8a050be652a80bf0ffd66"
const PASSWORD_HASH_SALT =
    "246j11hea0h2144oz98qs66g1hb6g2a26ea3c1b456dfs736aa3gdb5353a5cf7ccv0b5f3ycf8f72cxvfq1f12ccffv4f8jhf386fdf022adcad5fdc18db1ffan13f"
// todo: isolar constantes
const invalidSymbols = [
    "!",
    "@",
    "#",
    "$",
    "%",
    "¨",
    "&",
    "*",
    "(",
    ")",
    "_",
    "+",
    "<",
    ">",
    ":",
    "?",
    "^",
    "}",
    "{",
    "`",
    "´",
    "[",
    "]",
    "~",
    "/",
    ";",
    ".",
    ",",
    "ç",
]

function generateAccessToken(login, password) {
    return sha256.x2(`${login}${password}${TOKEN_HASH_SALT}`)
}

function hashPassword(login, password) {
    return sha256.x2(`${sha256(login)}${sha256(password)}${PASSWORD_HASH_SALT}`)
}

async function getUserFromToken(accessToken) {
    await database.connect()
    const user = await colaboradorModel.findOne({ "auth.accessToken": accessToken })
    await database.disconnect()
    return user
}

async function wipeUsers(request, response) {
    await database.connect()
    await colaboradorModel.deleteMany()
    await database.disconnect()
    return response.sendStatus(200)
}

function proxyEndpoint(endpoint) {
    function defaultRequestLog(request) {
        const now = new Date()
        console.warn(`request at "${request.baseUrl}" [${now.getMonth()}-${now.getDate()}-${now.getFullYear()} ${now.getHours()}:${now.getMinutes()}]`)
    }    
    const proxiedHandler = async (request, response) => {
        defaultRequestLog(request)
        if (endpoint.requiresAccessToken) {
            if (await isAccessTokenValid(request.header("Authorization"))) {
                request.user = await getUserFromToken(request.header("Authorization"))
                endpoint.handler(request, response)
            } else {
                return response.json({
                    message: "accessToken inválido",
                })
            }
        } else {
            endpoint.handler(request, response)
        }
    }
    return {
        ...endpoint,
        handler: proxiedHandler,
    }
}

async function isAccessTokenValid(accessToken) {
    if (!accessToken) {
        return false
    }
    await database.connect()
    const validTokens = new Array(await colaboradorModel.find({}, "auth.accessToken"))[0].map(
        ({ auth }) => auth.accessToken
    )
    await database.disconnect()
    return validTokens.includes(accessToken)
}

async function authenticate(request, response) {
    const { login, password } = request.body

    await database.connect()

    const colaborador = await colaboradorModel.findOne({
        "auth.login": login,
    })

    if (!colaborador) {
        await database.disconnect()
        return response.json({
            message: "Usuário inexistente",
        })
    }
    if (colaborador.auth.password === hashPassword(login, password)) {
        await database.disconnect()
        return response.json({
            accessToken: colaborador.auth.accessToken,
        })
    } else {
        await database.disconnect()
        return response.json({
            message: "Senha incorreta",
        })
    }
}

function validatePassword(password) {
    if (!password) {
        return {
            message: "Senha não pode estar em branco",
            valid: false,
        }
    } else if (password.length < 8) {
        return {
            message: "Senha deve possuir 8 ou mais caracteres",
            valid: false,
        }
    } else if (password.length >= 30) {
        return {
            message: "Senha deve possuir 30 ou menos caracteres",
            valid: false,
        }
    }
    return {
        message: "OK",
        valid: true,
    }
}

function validateLogin(login) {
    if (!login) {
        return {
            message: "Login não pode estar em branco",
            valid: false,
        }
    } else if (login.length < 5) {
        return {
            message: "Login deve possuir 5 ou mais caracteres",
            valid: false,
        }
    } else if (login.length >= 20) {
        return {
            message: "Login deve possuir 20 ou menos caracteres",
            valid: false,
        }
    } else if (invalidSymbols.some(symbol => login.includes(symbol))) {
        return {
            message: "Login possui caracteres inválidos",
            valid: false,
        }
    }

    return {
        message: "OK",
        valid: true,
    }
}

async function register(request, response) {
    const { login, nome, matricula, setor, password } = request.body

    const isLoginValid = validateLogin(login)

    if (!isLoginValid.valid) {
        return response.json({
            message: isLoginValid.message,
        })
    }

    await database.connect()

    const userExists = !!(await colaboradorModel.findOne({
        "auth.login": login,
    }))

    if (userExists) {
        await database.disconnect()
        return response.json({
            message: "Esse login já foi cadastrado",
        })
    }

    const isPasswordValid = validatePassword(password)

    if (!isPasswordValid.valid) {
        return response.json({ message: isPasswordValid.message })
    }

    const hashedPassword = hashPassword(login, password)

    const accessToken = generateAccessToken(login, hashedPassword)

    const colaborador = {
        nome,
        matricula,
        setor,
        auth: {
            login,
            accessToken,
            password: hashedPassword,
        },
    }

    const colaboradorDoc = new colaboradorModel(colaborador)

    await colaboradorDoc.save()
    await database.disconnect()

    return response.json({
        accessToken,
    })
}

module.exports = {
    authenticate,
    register,
    wipeUsers,
    proxyEndpoint,
    isAccessTokenValid,
    getUserFromToken,
}
