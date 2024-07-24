import multer from "multer"
import path from "path"
import fs from "fs"
import { AppError } from "../utils/calssError.js"
export const validExtension ={
    image:['image/png'],
    pdf :['application/pdf'],
    video: ['video/mp4']
}


export const multerHost =(customValidation=['application/pdf'])=>{
    const storage = multer.diskStorage({})
    const fileFilter = function(req,file,cb){
        if (customValidation.includes(file.mimetype)) {
            return cb(null ,true)
        }
        cb(new AppError('file not supported') , false)
    }
    const upload = multer({fileFilter, storage})
    return upload
}


