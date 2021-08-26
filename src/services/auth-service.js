const sha256 = require("sha256")
const usuarioModel = require("../models/usuarioModel.js")
const { tokenHashSalt, passwordHashSalt, invalidSymbols } = require("../config/auth-config")

function generateAccessToken(login, password) {
    return sha256.x2(`${login}${password}${tokenHashSalt}`)
}

function hashPassword(login, password) {
    return sha256.x2(`${sha256(login)}${sha256(password)}${passwordHashSalt}`)
}

async function getUserFromToken(accessToken) {
    const user = await usuarioModel.findOne({ "auth.accessToken": accessToken })
    return user
}

async function wipeUsers(request, response) {
    
    await usuarioModel.deleteMany()
    
    return response.sendStatus(200)
}

function proxyEndpoint(endpoint) {
    function defaultRequestLog(request) {
        const now = new Date()
        console.log(`request at "${request.originalUrl}" [${now.getMonth()}-${now.getDate()}-${now.getFullYear()} ${now.getHours()}:${now.getMinutes()}]`)
    }    
    const proxiedHandler = async (request, response) => {
        defaultRequestLog(request)
        if (endpoint.requiresAccessToken) {
            if (await isAccessTokenValid(request.header("Authorization"))) {
                request.user = await getUserFromToken(request.header("Authorization"))
                endpoint.handler(request, response)
            } else {
                response.status(401).json({ message: "Não autorizado" }).end();
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
    
    const validTokens = new Array(await usuarioModel.find({}, "auth.accessToken"))[0].map(
        ({ auth }) => auth.accessToken
    )
    
    return validTokens.includes(accessToken)
}

async function login(request, response) {
    const { username, senha } = request.body

    const usuario = await usuarioModel.findOne({
        "username": username,
    })

    if (!usuario) {
        return response.json({
            message: "Usuário inexistente",
        })
    }
    if (usuario.senha === hashPassword(username, senha)) {
        return response.json({
            accessToken: usuario.auth.accessToken,
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

async function validateAccessToken(request, response) {
    if(
        !request.body.accessToken ||
        await isAccessTokenValid(request.body.accessToken)
    ) {
        return response.json({ isValid: true })
    } else {
        return response.json({ isValid: false })
    }
}

async function register(request, response) {
    const { username, senha } = request.body

    const isLoginValid = validateLogin(username)

    if (!isLoginValid.valid) {
        return response.json({
            message: isLoginValid.message,
        })
    }

    const userExists = !!(await usuarioModel.findOne({
        "username": username,
    }))

    if (userExists) {
        return response.json({
            message: "Esse username já foi cadastrado",
        })
    }

    const isPasswordValid = validatePassword(senha)

    if (!isPasswordValid.valid) {
        return response.json({ message: isPasswordValid.message })
    }

    const hashedPassword = hashPassword(username, senha)

    const accessToken = generateAccessToken(username, hashedPassword)

    const usuario = {
        ...request.body,
        auth: {
            accessToken
        },
    }

    const usuarioDoc = new usuarioModel({
        ...usuario,
        senha: hashedPassword,
    })

    await usuarioDoc.save()

    return response.json({ accessToken: usuarioDoc.auth.accessToken})
}

module.exports = {
    login,
    register,
    wipeUsers,
    proxyEndpoint,
    isAccessTokenValid,
    getUserFromToken,
    validateAccessToken
}
