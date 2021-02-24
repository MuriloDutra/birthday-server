const databaseConnection = require('../database/connection')
const base64Img = require('base64-img')


class PhotosController{
    //GETTERS
    getPhotos(request, response){
        databaseConnection.select('*').table('photos')
            .then(photos => response.status(200).send(photos))
            .catch(error => response.status(500).send('error_to_load_photos'))
    }


    getApprovedPhotos(request, response){
        databaseConnection.select('*').table('photos').where({approved: 1})
            .then(photos => response.status(200).send(photos))
            .catch(error => response.status(500).send('error_to_load_approved_photos'))
    }


    getUnapprovedPhotos(request, response){
        databaseConnection.select('*').table('photos').where({approved: 0})
            .then(photos => response.status(200).send(photos))
            .catch(error => response.status(500).send('error_to_load_unapproved_photos'))
    }


    getPhotoById(request, response){
        const { id } = request.params

        databaseConnection.select('*').table('photos').where({id: id})
            .then(photo => response.status(200).send(photo))
            .catch(error => response.status(500).send('error_to_get_photo_by_id'))
    }


    getHighlightPhotos(request, response){
        databaseConnection.select('*').table('photos').where({highlightImage: 1})
            .then(photos => response.status(200).send(photos))
            .catch(error => response.status(500).send('error_to_load_highlight_photos'))
    }


    //POST
    async newPhotos(request, response){
        try{
            const { imagesBase64 } = request.body

            imagesBase64.forEach((image, index) => {
                const date = Date.now()

                base64Img.img(image, 'public', date, async (err, filepath) => {
                    const pathArr = filepath.split('/')
                    const fileName = pathArr[pathArr.length - 1]
                    const positionDot = fileName.match(/\./).index
                    const fileType = fileName.slice(positionDot, fileName.length)
                    const imageUrl = `http://localhost:4000/static/${date}${fileType}`

                    //await databaseConnection.insert({imageUrl}).table('photos')

                    if(imagesBase64.length - 1 === index){
                        let message = imagesBase64.length > 1 ? 'Fotos enviadas com sucesso!' : 'Foto enviadas com sucesso!'
                        response.status(200).send({message: message})
                    }
                })
            })
        }catch(error){
            response.status(500).send('error_to_post_new_photos')
        }
    }


    //UPDATE
    updatePhoto(request, response){
        const { id } = request.params
        const { imageUrl, englishDescription, portugueseDescription, photoType, approved, highlightImage } = request.body

        databaseConnection.where({id: id}).update({imageUrl, englishDescription, portugueseDescription, photoType, approved, highlightImage}).table('photos')
            .then(updatedPhoto => response.status(200).send({message: 'Informações atualizadas com sucesso!'}))
            .catch(error => response.status(500).send('error_to_update_photo'))
    }


    //DELETE
    deletePhoto(request, response){
        const { id } = request.params

        databaseConnection.where({id: id}).del().table('photos')
            .then(data => response.status(200).send({message: 'Foto apagada!'}))
            .catch(error => response.status(500).send('error_to_delete_photo'))
    }
}


module.exports = new PhotosController()