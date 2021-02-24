const express = require('express')
const app = express()
const base64Img = require('base64-img')
const bodyParser = require('body-parser');
const cors = require('cors')
const port = 4000

const photosRoutes = require('./src/routes/photos.route')
const userRoutes = require('./src/routes/user.route')

app.use(cors())
app.use('/static', express.static('public'))
app.use(bodyParser.json({parameterLimit: 100000, limit: '50mb', extended: true}))

//Routes
app.use(userRoutes)
app.use(photosRoutes)

app.listen(port, () => console.log(`Server running at http://localhost:4000`))