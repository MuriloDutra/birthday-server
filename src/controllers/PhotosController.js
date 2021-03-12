const databaseConnection = require('../database/connection')
const saveImageOnServer = require('../helpers/index')


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
    newPhotos(request, response){
        try{
            const { imagesBase64 } = request.body
            
            imagesBase64.forEach(async (image, index) => {
                const date = Date.now()
                const filename = saveImageOnServer(image, date)
                const filePath = `http://localhost:4000/static/${filename.slice(7, filename.length)}`

                await databaseConnection.insert({imageUrl: filePath, approved: 0}).table('photos')

                if(imagesBase64.length - 1 === index){
                    let message = imagesBase64.length > 1 ? 'Fotos enviadas com sucesso!' : 'Foto enviadas com sucesso!'
                    response.status(200).send({message: message})
                }
            })
        }catch(error){
            response.status(500).send('error_to_post_new_photos')
        }
    }


    //UPDATE
    updatePhoto(request, response){
        const { id } = request.params
        const { englishDescription, portugueseDescription, imageName } = request.body

        databaseConnection.where({id: id}).update({englishDescription, portugueseDescription, imageName}).table('photos')
            .then(updatedPhoto => response.status(200).send({message: 'Informações da foto atualizadas com sucesso!'}))
            .catch(error => response.status(500).send('error_to_update_photo'))
    }


    approvePhotoById(request, response){
        const { id } = request.params

        databaseConnection.where({id: id}).update({approved: 1}).table('photos')
            .then(updatedPhoto => response.status(200).send({message: 'Foto aprovada com sucesso!'}))
            .catch(error => response.status(500).send('error_to_update_photo'))
    }


    unapprovePhotoById(request, response){
        const { id } = request.params

        databaseConnection.where({id: id}).update({approved: 0}).table('photos')
            .then(updatedPhoto => response.status(200).send({message: 'Foto desaprovada com sucesso!'}))
            .catch(error => response.status(500).send('error_to_update_photo'))
    }


    highlightPhotoById(request, response){
        const { id } = request.params

        databaseConnection.where({id: id}).update({highlightImage: 1}).table('photos')
            .then(updatedPhoto => response.status(200).send({message: 'Foto adicionada aos destaques!'}))
            .catch(error => response.status(500).send('error_to_higilight_photo'))
    }


    unhighlightPhotoById(request, response){
        const { id } = request.params

        databaseConnection.where({id: id}).update({highlightImage: 0}).table('photos')
            .then(updatedPhoto => response.status(200).send({message: 'Foto removida dos destaques!'}))
            .catch(error => response.status(500).send('error_to_unhigilight_photo'))
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