var express = require('express')
var router = express.Router()

router.get('/getPhotos', (req, res) => {
    res.send('Hello')
})

router.post('/sendPhotos', (req, res) => {
    res.sendStatus(200)('POST request to the homepage');
});

module.exports = router