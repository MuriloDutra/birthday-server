const databaseConnection = require('../database/connection')
const base64Img = require('base64-img')


class PhotosController{
    //GETTERS
    getPhotos(request, response){
        databaseConnection.select('*').table('photos')
            .then(photos => response.json(photos))
            .catch(error => console.log('ERROR: ', error))
    }


    getApprovedPhotos(request, response){
        databaseConnection.select('*').table('photos').where({approved: 1})
            .then(photos => response.json(photos))
            .catch(error => console.log('ERROR: ', error))
    }


    getUnapprovedPhotos(request, response){
        databaseConnection.select('*').table('photos').where({approved: 0})
            .then(photos => response.json(photos))
            .catch(error => console.log('ERROR: ', error))
    }


    getPhotoById(request, response){
        const { id } = request.params

        databaseConnection.select('*').table('photos').where({id: id})
            .then(photo => response.json(photo))
            .catch(error => console.log('ERROR: ', error))
    }


    getHighlightPhotos(request, response){
        databaseConnection.select('*').table('photos').where({highlightImage: 1})
            .then(photos => response.json(photos))
            .catch(error => console.log('ERROR: ', error))
    }


    //POST
    async newPhotos(request, response){
        try{
            const { imageUrl, englishDescription, portugueseDescription, photoType, approved, highlightImage } = request.body
            
            base64Img.img(imageUrl, 'public', Date.now(), (err, filepath) => {
                const pathArr = filepath.split('/')
                const fileName = pathArr[pathArr.length - 1]

                response.send({
                    success: true,
                    url: `htpp://127.0.0.1:4000/${fileName}`
                })
            })
            /*databaseConnection.insert({imageUrl, englishDescription, portugueseDescription, photoType, approved, highlightImage}).table('photos')
                .then(data => response.json({message: 'Foto enviada com sucesso!'}))
                .catch(error => console.log('ERROR: ', error))*/
        }catch(error){
            console.log(error)
        }
    }


    //UPDATE
    updatePhoto(request, response){
        const { id } = request.params
        const { imageUrl, englishDescription, portugueseDescription, photoType, approved, highlightImage } = request.body

        databaseConnection.where({id: id}).update({imageUrl, englishDescription, portugueseDescription, photoType, approved, highlightImage}).table('photos')
            .then(updatedPhoto => response.json({message: 'Informações atualizadas com sucesso!'}))
            .catch(error => console.log('ERROR: ', error))
    }


    //DELETE
    deletePhoto(request, response){
        const { id } = request.params

        databaseConnection.where({id: id}).del().table('photos')
            .then(data => response.json({message: 'Foto apagada!'}))
            .catch(error => console.log('ERROR: ', error))
    }
}


module.exports = new PhotosController()