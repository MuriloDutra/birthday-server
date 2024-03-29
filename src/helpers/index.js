const base64Img = require('base64-img')
const databaseConnection = require('../database/connection')


function saveImageOnServer(image, date){
    return base64Img.imgSync(image, 'public', date, (err, filepath) => {
        const pathArr = filepath.split('/')
        const fileName = pathArr[pathArr.length - 1]
        const positionDot = fileName.match(/\./).index
        const fileType = fileName.slice(positionDot, fileName.length)
        `http://localhost:4000/static/${date}${fileType}`
    })
}


function findUserByToken(token){
    return databaseConnection('user').where({token}).select('*')
        .then((data) => {
            if(data.length === 0){
                return false
            }else{
                return true
            }
        })
        .catch(error => false)
}


function checkIfImageExist(id){
    return databaseConnection('photos').where({id}).select('*')
        .then((data) => {
            if(data.length === 0){
                return false
            }

            return true
        })
}


function paginate(request){
    const { query } = request
    const pageNumber = parseInt(query.pageNumber || 0);
    const pageSize = parseInt(query.pageSize || 20)
    const offset = (pageNumber * pageSize);

    return {
        pageSize: pageSize,
        offset: offset,
        pageNumber: pageNumber
    }
}


exports.saveImageOnServer = saveImageOnServer;
exports.findUserByToken = findUserByToken;
exports.checkIfImageExist = checkIfImageExist;
exports.paginate = paginate;