const express = require('express')
const router = express.Router()
const PhotosController = require('../controllers/PhotosController')

router.get('/', (req, res) => {
    res.send('Birthday server running and ready to go!')
})

//GET
router.get('/getApprovedPhotos', PhotosController.getApprovedPhotos)

router.get('/getDisapprovedPhotos', PhotosController.getDisapprovedPhotos)

router.get('/getHighlightPhotos', PhotosController.getHighlightPhotos)

router.get('/getPhotos', PhotosController.getPhotos)

router.get('/getPhotoById/:id', PhotosController.getPhotoById)

//POST
router.post('/sendPhotos', PhotosController.newPhotos);

//PUT
router.put('/updatePhoto/:id', PhotosController.updatePhoto)

router.put('/approvePhotoById/:id', PhotosController.approvePhotoById)

router.put('/disapprovePhotoById/:id', PhotosController.disapprovePhotoById)

router.put('/highlightPhotoById/:id', PhotosController.highlightPhotoById)

router.put('/unhighlightPhotoById/:id', PhotosController.unhighlightPhotoById)

//DELETE
router.delete('/deletePhoto/:id', PhotosController.deletePhoto)

module.exports = router