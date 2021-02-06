const express = require('express')
const router = express.Router()
const database = require('../database/connection')
const PhotosController = require('../controllers/PhotosController')

router.get('/', (req, res) => {
    res.send('Birthday server running and ready to go!')
})

router.get('/getApprovedPhotos', PhotosController.getApprovedPhotos)

router.get('/getUnapprovedPhotos', PhotosController.getUnapprovedPhotos)

router.get('/getHighlightPhotos', PhotosController.getHighlightPhotos)

router.get('/getPhotos', PhotosController.getPhotos)

router.get('/getPhotoById/:id', PhotosController.getPhotoById)

router.post('/sendPhotos', PhotosController.newPhotos);

router.put('/updatePhoto/:id', PhotosController.updatePhoto)

router.delete('/deletePhoto/:id', PhotosController.deletePhoto)

module.exports = router