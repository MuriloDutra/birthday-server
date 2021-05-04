const serverMessages = require('../constants/serverMessages');
const databaseConnection = require('../database/connection')
const helper = require('../helpers/index');


class PhotosController{
    //GETTERS
    async getPhotos(request, response){
        const { authorization } = request.headers
        const user =  await helper.findUserByToken(authorization)

        if(user){
            const paginateParams = helper.paginate(request)

            Promise.all([
                databaseConnection.count('* as count').from('photos').first(),
                databaseConnection.select('*').table('photos').offset(paginateParams.offset).limit(paginateParams.pageSize)
            ])
                .then(([total, rows]) => response.status(200).send(rows))
                .catch(error => response.status(500).send({error: serverMessages.photos.error_to_load_photos}))
        }else{
            response.status(401).send({error: serverMessages.user.user_not_found})
        }
    }


    getApprovedPhotos(request, response){
        const paginateParams = helper.paginate(request)

        Promise.all([
            databaseConnection.count('* as count').from('photos').first(),
            databaseConnection.select('*').table('photos').where({approved: 1}).offset(paginateParams.offset).limit(paginateParams.pageSize)
        ])
            .then(([total, rows]) => response.status(200).send(rows))
            .catch(error => response.status(500).send({error: serverMessages.photos.error_to_load_photos}))
    }


    async getDisapprovedPhotos(request, response){
        const { authorization } = request.headers
        const user =  await helper.findUserByToken(authorization)

        if(user){
            const paginateParams = helper.paginate(request)

            Promise.all([
                databaseConnection.count('* as count').from('photos').first(),
                databaseConnection.select('*').table('photos').where({approved: 0}).offset(paginateParams.offset).limit(paginateParams.pageSize)
            ])
                .then(([total, rows]) => response.status(200).send(rows))
                .catch(error => response.status(500).send({error: serverMessages.photos.error_to_load_disapproved_photos}))
        }else{
            response.status(401).send({error: serverMessages.user.user_not_found})
        }
    }


    async getPhotoById(request, response){
        const { id } = request.params
        const { authorization } = request.headers
        const user =  await helper.findUserByToken(authorization)
        const imageExist = await helper.checkIfImageExist(id)

        if(!imageExist){
            response.status(404).send({error: serverMessages.photos.photo_not_found})
            return
        }

        if(user){
            databaseConnection.select('*').table('photos').where({id: id})
                .then(photo => response.status(200).send(photo))
                .catch(error => response.status(500).send({error: serverMessages.photos.error_to_get_photo_by_id}))
        }else{
            response.status(401).send({error: serverMessages.user.user_not_found})
        }
    }


    getHighlightPhotos(request, response){
        const paginateParams = helper.paginate(request)

        Promise.all([
            databaseConnection.count('* as count').from('photos').first(),
            databaseConnection.select('*').table('photos').where({highlightImage: 1}).offset(paginateParams.offset).limit(paginateParams.pageSize)
        ])
            .then(([total, rows]) => response.status(200).send(rows))
            .catch(error => response.status(500).send({error: serverMessages.photos.error_to_load_highlight_photos}))            
    }


    //POST
    newPhotos(request, response){
        try{
            const { imagesBase64 } = request.body
            
            imagesBase64.forEach(async (image, index) => {
                const date = Date.now()
                const filename = helper.saveImageOnServer(image, date)
                const filePath = `http://localhost:4000/static/${filename.slice(7, filename.length)}`

                await databaseConnection.insert({imageUrl: filePath, approved: 0}).table('photos')

                if(imagesBase64.length - 1 === index){
                    let message = imagesBase64.length > 1 ? serverMessages.photos.photos_received : serverMessages.photos.photo_received
                    response.status(200).send({message: message})
                }
            })
        }catch(error){
            response.status(500).send({error: serverMessages.photos.error_to_post_new_photos})
        }
    }


    //UPDATE
    async updatePhoto(request, response){
        const { authorization } = request.headers
        const user =  await helper.findUserByToken(authorization)
        const { id } = request.params
        const imageExist = await helper.checkIfImageExist(id)

        if(!imageExist){
            response.status(404).send({error: serverMessages.photos.photo_not_found})
            return
        }

        if(user){
            const { englishDescription, portugueseDescription, imageName } = request.body

            databaseConnection.where({id: id}).update({englishDescription, portugueseDescription, imageName}).table('photos')
                .then(updatedPhoto => response.status(200).send({message: serverMessages.photos.photo_was_updated}))
                .catch(error => response.status(500).send({error: serverMessages.photos.error_to_update_photo}))
        }else{
            response.status(401).send({error: serverMessages.user.user_not_found})
        }
    }


    async approvePhotoById(request, response){
        const { authorization } = request.headers
        const user =  await helper.findUserByToken(authorization)
        const { id } = request.params
        const imageExist = await helper.checkIfImageExist(id)

        if(!imageExist){
            response.status(404).send({error: serverMessages.photos.photo_not_found})
            return
        }

        if(user){
            databaseConnection.where({id: id}).update({approved: 1}).table('photos')
                .then(updatedPhoto => response.status(200).send({message: serverMessages.photos.photo_was_approved}))
                .catch(error => response.status(500).send({error: serverMessages.photos.error_to_approve_photo}))
        }else{
            response.status(401).send({error: serverMessages.user.user_not_found})
        }
    }


    async disapprovePhotoById(request, response){
        const { authorization } = request.headers
        const user =  await helper.findUserByToken(authorization)
        const { id } = request.params
        const imageExist = await helper.checkIfImageExist(id)

        if(!imageExist){
            response.status(404).send({error: serverMessages.photos.photo_not_found})
            return
        }

        if(user){
            databaseConnection.where({id: id}).update({approved: 0}).table('photos')
                .then(updatedPhoto => response.status(200).send({message: serverMessages.photos.photo_was_disapproved}))
                .catch(error => response.status(500).send({error: serverMessages.photos.error_to_disapprove_photo}))
        }else{
            response.status(401).send({error: serverMessages.user.user_not_found})
        }
    }


    async highlightPhotoById(request, response){
        const { authorization } = request.headers
        const user =  await helper.findUserByToken(authorization)
        const { id } = request.params
        const imageExist = await helper.checkIfImageExist(id)

        if(!imageExist){
            response.status(404).send({error: serverMessages.photos.photo_not_found})
            return
        }

        if(user){
            databaseConnection.where({id: id}).update({highlightImage: 1}).table('photos')
                .then(updatedPhoto => response.status(200).send({message: serverMessages.photos.photo_was_highlighted}))
                .catch(error => response.status(500).send({error: serverMessages.photos.error_to_higilight_photo}))
        }else{
            response.status(401).send({error: serverMessages.user.user_not_found})
        }        
    }


    async unhighlightPhotoById(request, response){
        const { authorization } = request.headers
        const user =  await helper.findUserByToken(authorization)
        const { id } = request.params
        const imageExist = await helper.checkIfImageExist(id)

        if(!imageExist){
            response.status(404).send({error: serverMessages.photos.photo_not_found})
            return
        }
        
        if(user){
            databaseConnection.where({id: id}).update({highlightImage: 0}).table('photos')
                .then(updatedPhoto => response.status(200).send({message: serverMessages.photos.photo_was_unhighlighted}))
                .catch(error => response.status(500).send({error: serverMessages.photos.error_to_unhigilight_photo}))
        }else{
            response.status(401).send({error: serverMessages.user.user_not_found})
        }
    }


    //DELETE
    async deletePhoto(request, response){
        const { authorization } = request.headers
        const user =  await helper.findUserByToken(authorization)
        const { id } = request.params
        const imageExist = await helper.checkIfImageExist(id)

        if(!imageExist){
            response.status(404).send({error: serverMessages.photos.photo_not_found})
            return
        }

        if(user){
            databaseConnection.where({id: id}).del().table('photos')
                .then(data => response.status(200).send({message: serverMessages.photos.photo_deleted}))
                .catch(error => response.status(500).send({error: serverMessages.photos.error_to_delete_photo}))
        }else{
            response.status(401).send({error: serverMessages.user.user_not_found})
        }
    }
}


module.exports = new PhotosController()