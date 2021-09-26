const serverMessages = require('../constants/serverMessages');
const database_connection = require('../database/connection')
const helper = require('../helpers/index');

class PhotosController{
    //GETTERS
    async getPhotos(request, response){
        const { authorization } = request.headers
        const user =  await helper.findUserByToken(authorization)

        if(user){
            const paginateParams = helper.paginate(request)

            Promise.all([
                database_connection.count('* as count').from('photos').first(),
                database_connection.select('*').table('photos').offset(paginateParams.offset).limit(paginateParams.pageSize)
            ])
                .then(([total, rows]) => response.status(200).send(rows))
                .catch(() => response.status(500).send({error: serverMessages.photos.error_to_load_photos}))
        }else
            response.status(401).send({error: serverMessages.user.error_user_not_found})
    }


    getApprovedPhotos(request, response){
        const paginateParams = helper.paginate(request)
        const { sort } = request.query;
        let query;

        if(!sort)
            query = database_connection.select('*').table('photos').where({approved: 1}).where({highlightImage: 0});
        else if(sort && sort === "ALL_IMAGES")
            query = database_connection.select('*').table('photos').where({approved: 1});

        Promise.all([
            database_connection.count('* as count').from('photos').first(),
            query
                .offset(paginateParams.offset).limit(paginateParams.pageSize)
        ])
            .then(([total, rows]) => response.status(200).send(rows))
            .catch(() => response.status(500).send({error: serverMessages.photos.error_to_load_photos}))
    }


    async getDisapprovedPhotos(request, response){
        const { authorization } = request.headers
        const user =  await helper.findUserByToken(authorization)

        if(user){
            const paginateParams = helper.paginate(request)

            Promise.all([
                database_connection.count('* as count').from('photos').first(),
                database_connection.select('*').table('photos').where({approved: 0}).offset(paginateParams.offset).limit(paginateParams.pageSize)
            ])
                .then(([total, rows]) => response.status(200).send(rows))
                .catch(() => response.status(500).send({error: serverMessages.photos.error_to_load_disapproved_photos}))
        }else
            response.status(401).send({error: serverMessages.user.error_user_not_found})
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
            database_connection.select('*').table('photos').where({id: id})
                .then((photo) => response.status(200).send(photo[0]))
                .catch(() => response.status(500).send({error: serverMessages.photos.error_to_get_photo_by_id}))
        }else
            response.status(401).send({error: serverMessages.user.error_user_not_found})
    }


    getHighlightPhotos(request, response){
        database_connection.select('*').table('photos').where({highlightImage: 1})
            .then((photos) => response.status(200).send(photos))
            .catch(() => response.status(500).send({error: serverMessages.photos.error_to_load_highlight_photos}))
    }


    searchPhoto(request, response){
        const { searchText } = request.query
    
        database_connection.select("*").from('photos').where({approved: 1}).and.where('imageName', 'like', `%${searchText}%`)
            .then((photos) => response.status(200).send(photos))
            .catch(() => response.status(500).send({error: serverMessages.photos.error_to_search_photos}))            
    }


    //POST
    newPhotos(request, response){
        try{
            const { imagesBase64 } = request.body
            
            imagesBase64.forEach(async (image, index) => {
                const date = Date.now()
                const filename = helper.saveImageOnServer(image, date)
                const filePath = `http://localhost:4000/static/${filename.slice(7, filename.length)}`

                await database_connection.insert({imageUrl: filePath, approved: 0}).table('photos')

                if(imagesBase64.length - 1 === index){
                    let message = imagesBase64.length > 1 ? serverMessages.photos.success_photos_received : serverMessages.photos.success_photo_received
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

            database_connection.where({id: id}).update({englishDescription, portugueseDescription, imageName}).table('photos')
                .then(updatedPhoto => response.status(200).send({message: serverMessages.photos.success_photo_was_updated}))
                .catch(() => response.status(500).send({error: serverMessages.photos.error_to_update_photo}))
        }else
            response.status(401).send({error: serverMessages.user.error_user_not_found})
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
            database_connection.where({id: id}).update({approved: 1}).table('photos')
                .then((updatedPhoto) => response.status(200).send({message: serverMessages.photos.success_photo_was_approved}))
                .catch(() => response.status(500).send({error: serverMessages.photos.error_to_approve_photo}))
        }else
            response.status(401).send({error: serverMessages.user.error_user_not_found})
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
            database_connection.where({id: id}).update({approved: 0}).table('photos')
                .then(updatedPhoto => response.status(200).send({message: serverMessages.photos.success_photo_was_disapproved}))
                .catch(() => response.status(500).send({error: serverMessages.photos.error_to_disapprove_photo}))
        }else
            response.status(401).send({error: serverMessages.user.error_user_not_found})
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
            database_connection.select('*').table('photos').where({highlightImage: 1})
                .then((photos) => {
                    if(photos.length >= 10){
                        response.status(406).send({error: serverMessages.photos.error_already_ten_highlighted_photos})
                        return
                    }

                    database_connection.where({id: id}).update({highlightImage: 1}).table('photos')
                        .then(updatedPhoto => response.status(200).send({message: serverMessages.photos.success_photo_was_highlighted}))
                        .catch(() => response.status(500).send({error: serverMessages.photos.error_to_higilight_photo}))
                })
        }else
            response.status(401).send({error: serverMessages.user.error_user_not_found})
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
            database_connection.where({id: id}).update({highlightImage: 0}).table('photos')
                .then(updatedPhoto => response.status(200).send({message: serverMessages.photos.success_photo_was_unhighlighted}))
                .catch(() => response.status(500).send({error: serverMessages.photos.error_to_unhigilight_photo}))
        }else
            response.status(401).send({error: serverMessages.user.error_user_not_found})
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
            database_connection.where({id: id}).del().table('photos')
                .then(data => response.status(200).send({message: serverMessages.photos.success_photo_deleted}))
                .catch(() => response.status(500).send({error: serverMessages.photos.error_to_delete_photo}))
        }else
            response.status(401).send({error: serverMessages.user.error_user_not_found})
    }
}


module.exports = new PhotosController()