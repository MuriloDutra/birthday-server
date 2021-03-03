const base64Img = require('base64-img')

function saveImageOnServer(image, date){
    return base64Img.imgSync(image, 'public', date, (err, filepath) => {
        const pathArr = filepath.split('/')
        const fileName = pathArr[pathArr.length - 1]
        const positionDot = fileName.match(/\./).index
        const fileType = fileName.slice(positionDot, fileName.length)
        `http://localhost:4000/static/${date}${fileType}`
    })
}

module.exports = saveImageOnServer