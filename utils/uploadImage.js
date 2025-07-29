const cloudinary = require('./cloudinary');
const streamifier = require('streamifier');

const uploadToCloud = (buffer, folder = 'uploads') =>{
    return new Promise((resolve, reject)=>{
        const cloudStream = cloudinary.uploader.upload_stream(
            {folder},
            (err, result) =>{
                if(err) return reject(err);
                const resultObj = {
                   url:  result.secure_url,
                   publicId : result.public_id,
                }
                resolve(resultObj);
            }
        )

        const stream = streamifier.createReadStream(buffer);
        stream.pipe(cloudStream);
    })    
}

const deleteFromCloud = (publicId) =>{
    return new Promise((resolve, reject)=>{
        console.log("phase 1 started")
        cloudinary.uploader.destroy(publicId,{invalidate : true} , (err, result) =>{
                if(err) reject(err)
                resolve(result);
                console.log("this is the result", result)
            }
        )
    })
}
module.exports = {uploadToCloud, deleteFromCloud}