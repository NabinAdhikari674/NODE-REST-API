const multer = require('multer');

const storage = multer.diskStorage({
    destination: (request,file,callback)=> {
        callback(null,'./uploads/');
    },
    filename: (request,file,callback)=> {
        callback(null, Date.now()+"_"+file.originalname);
    }
});
const filter = (request,file,callback) =>{
    let ft = file.mimetype;
    if(ft ==='image/jpeg'||ft ==='image/jpg'||ft ==='image/png'||ft ==='image/gif'){
        callback(null,true);
    } else {
        const error = new Error("Invalid File Type[Only Jpeg/Jpg/Png/Gif Supported].File not Uploaded !!");
        error.status = 415;
        callback(error, false);
    }
};
const upload = multer({
    storage:storage,
    limits:{
        filesize:1024*1024*5
    },
    fileFilter:filter
});

module.exports = upload;