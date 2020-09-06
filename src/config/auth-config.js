const tokenHashSalt = process.env.AUTH_TOKEN_HASH_SALT
const passwordHashSalt = process.env.AUTH_PASSWORD_HASH_SALT
const invalidSymbols = process.env.AUTH_INVALID_SYMBOLS


module.exports = (() => ({
    tokenHashSalt,
    passwordHashSalt,
    invalidSymbols: invalidSymbols.split(''),
}))()
