const sha256 = require("sha256")
const colaboradorModel = require("../models/colaboradorModel")
const { tokenHashSalt, passwordHashSalt, invalidSymbols } = require("../config/auth-config")

function generateAccessToken(login, password) {
    return sha256.x2(`${login}${password}${tokenHashSalt}`)
}

function hashPassword(login, password) {
    return sha256.x2(`${sha256(login)}${sha256(password)}${passwordHashSalt}`)
}

async function getUserFromToken(accessToken) {
    const user = await colaboradorModel.findOne({ "auth.accessToken": accessToken })
    return user
}

async function wipeUsers(request, response) {
    
    await colaboradorModel.deleteMany()
    
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
    
    const validTokens = new Array(await colaboradorModel.find({}, "auth.accessToken"))[0].map(
        ({ auth }) => auth.accessToken
    )
    
    return validTokens.includes(accessToken)
}

async function authenticate(request, response) {
    const { login, password } = request.body

    const colaborador = await colaboradorModel.findOne({
        "auth.login": login,
    })

    if (!colaborador) {
        return response.json({
            message: "Usuário inexistente",
        })
    }
    if (colaborador.auth.password === hashPassword(login, password)) {
        return response.json({
            accessToken: colaborador.auth.accessToken,
        })
    } else {
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

    const userExists = !!(await colaboradorModel.findOne({
        "auth.login": login,
    }))

    if (userExists) {
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
