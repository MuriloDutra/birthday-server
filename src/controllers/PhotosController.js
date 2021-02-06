const database = require('../database/connection')


class PhotosController{
    //GETTERS
    getPhotos(request, response){
        database.select('*').table('photos')
            .then(photos => response.json(photos))
            .catch(error => console.log('ERROR: ', error))
    }


    getApprovedPhotos(request, response){
        database.select('*').table('photos').where({approved: 1})
            .then(photos => response.json(photos))
            .catch(error => console.log('ERROR: ', error))
    }


    getUnapprovedPhotos(request, response){
        database.select('*').table('photos').where({approved: 0})
            .then(photos => response.json(photos))
            .catch(error => console.log('ERROR: ', error))
    }


    getPhotoById(request, response){
        const { id } = request.params

        database.select('*').table('photos').where({id: id})
            .then(photo => response.json(photo))
            .catch(error => console.log('ERROR: ', error))
    }


    getHighlightPhotos(request, response){
        database.select('*').table('photos').where({highlightImage: 1})
            .then(photos => response.json(photos))
            .catch(error => console.log('ERROR: ', error))
    }


    //POST
    newPhotos(request, response){
        const { imageUrl, englishDescription, portugueseDescription, photoType, approved, highlightImage } = request.body

        database.insert({imageUrl, englishDescription, portugueseDescription, photoType, approved, highlightImage}).table('photos')
            .then(data => response.json({message: 'Foto enviada com sucesso!'}))
            .catch(error => console.log('ERROR: ', error))
    }


    //UPDATE
    updatePhoto(request, response){
        const { id } = request.params
        const { imageUrl, englishDescription, portugueseDescription, photoType, approved, highlightImage } = request.body

        database.where({id: id}).update({imageUrl, englishDescription, portugueseDescription, photoType, approved, highlightImage}).table('photos')
            .then(updatedPhoto => response.json({message: 'Informações atualizadas com sucesso!'}))
            .catch(error => console.log('ERROR: ', error))
    }


    //DELETE
    deletePhoto(request, response){
        const { id } = request.params

        database.where({id: id}).del().table('photos')
            .then(data => response.json({message: 'Foto apagada!'}))
            .catch(error => console.log('ERROR: ', error))
    }
}


module.exports = new PhotosController()