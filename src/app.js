const express = require('express')
var cors = require('cors')

//const bodyParser = require('body-parser');
//app.use(bodyParser.urlencoded({limit: '100mb'}))
//app.use(bodyParser.json({limit: '100mb'}))
const routes = require('./routes/photos.route')

const app = express()

app.use(cors())
app.use(express.json())
app.use(routes)


//START SERVER
app.listen(4000, () => {
    console.log(`Server running at http://localhost:4000`)
})
