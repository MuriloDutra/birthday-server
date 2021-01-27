const hostname = '127.0.0.1'
const port = 3000

var express = require('express')
const bodyParser = require('body-parser');
const routes = require('./routes/photos.route')
var cors = require('cors')
var app = express()

app.use(routes)
app.use(cors())
app.use(bodyParser.urlencoded({limit: '100mb'}))
app.use(bodyParser.json({limit: '100mb'}))

//START SERVER
app.listen(port, () => {
    console.log(`Server running at http://${hostname}:${port}`)
})
