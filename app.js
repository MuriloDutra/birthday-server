const hostname = '127.0.0.1'
const port = 3000

var express = require('express')
const bodyParser = require('body-parser');
var cors = require('cors')
var app = express()

app.use(cors())
app.use(bodyParser.urlencoded({limit: '100mb'}))
app.use(bodyParser.json({limit: '100mb'}))

app.get('/', (req, res) => {
    res.send('Hello man')
})

app.post('/sendPhotos', (req, res) => {
    console.log('BODY: ', req.body)
    res.sendStatus(200)('POST request to the homepage');
});  

app.listen(port, () => {
    console.log(`Server running at http://${hostname}:${port}`)
})