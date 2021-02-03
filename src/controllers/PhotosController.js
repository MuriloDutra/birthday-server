const { table } = require('../database/connection')
const database = require('../database/connection')

class PhotosController{
    newPhotos(request, response){
        console.log('newPhoto | REQUEST.BODY: ', request.body)

        const { imageUrl, englishDescription, portugueseDescription, photoType, approved, highlightImage } = request.body

        database.insert({imageUrl, englishDescription, portugueseDescription, photoType, approved, highlightImage}).table('photos')
            .then(data => {
                console.log('DATA: ', data)
                response.json({message: 'Foto enviada com sucesso!'})
            })
            .catch(error => console.log('ERROR: ', error))
    }


    getPhotos(request, response){
        database.select('*').table('photos')
            .then(photos => {
                console.log('photos: ', photos)
                response.json(photos)
            })
            .catch(error => console.log('ERROR: ', error))
    }


    getApprovedPhotos(request, response){
        database.select('*').table('photos').where({approved: 1})
            .then(photos => response.json(photos))
            .catch(error => console.log('ERROR: ', error))
    }


    getPhotoById(request, response){
        const id = request.params

        database.select('*').table('photos').where({id: id})
            .then(photo => response.json(photo))
            .catch(error => console.log('ERROR: ', error))
    }


    updatePhoto(request, response){
        const id = request.params
        console.log('PARAMS: ', request.params)
        console.log('BODY: ', request.body)

        const { imageUrl, englishDescription, portugueseDescription, photoType, approved, highlightImage } = request.body

        database.where({id: id}).update({imageUrl: imageUrl}).table('photos')
            .then(updatedPhoto => {
                console.log('updatedPhoto: ', updatedPhoto)
                response.json({message: 'Informações atualizadas com sucesso!'})
            })
            .catch(error => console.log('ERROR: ', error))
    }


    deletePhoto(request, response){
        const id = request.params

        console.log('PARAMS: ', request.params)
        console.log('BODY: ', request.body)

        database.where({id: id}).del().table('photos')
            .then(data => response.json({message: 'Foto apagada!'}))
            .catch(error => console.log('ERROR: ', error))
    }
}

module.exports = new PhotosController()