const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")
const app = express()
const port = 3001
const { initializeEndpoints } = require("./endpoints")

app.use(cors())
app.use(bodyParser.json())
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
)

initializeEndpoints(app)

app.listen(port, () => {
    console.log("Server running on port: " + port)
})
