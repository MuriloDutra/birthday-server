const serverMessages = require('../constants/serverMessages')
const databaseConnection = require('../database/connection')


class UserController{
    getUser(request, response){
        const { email, password } = request.body

        databaseConnection('user').where({email: email, accountPassword: password}).select('*')
            .then(data => {
                if(data.length === 0){
                    response.status(404).send(serverMessages.user.user_not_found)
                    return
                }

                response.status(200).send({email: data[0].email, token: data[0].token})
            })
            .catch(error => response.status(500).send(serverMessages.user.error_to_get_user))
    }
}


module.exports = new UserController()