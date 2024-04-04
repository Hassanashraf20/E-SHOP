const apiError = require("../utils/apiError")
const multer  = require('multer')



const multerOption=()=>{
    const multerStorage = multer.memoryStorage()
    
      const multerFilter = function (req,file,cb){
        if(file.mimetype.startsWith('image')){
           cb(null, true)
         }else{
            cb(new apiError('Only Images Allowed',400),false)
        }
       }
       const upload = multer({ storage: multerStorage, fileFilter: multerFilter })
       return upload   
      
      }
     


exports.uploadSingleImage=(fieldname)=>
multerOption().single(fieldname)



exports.uploadMixImage=(arrayOfFields)=>
multerOption().fields(arrayOfFields)

