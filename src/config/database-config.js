const hostname = process.env.DATABASE_HOSTNAME

const defaultConnectionArgs = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}

module.exports = (() => ({
        hostname,
        defaultConnectionArgs
}))()