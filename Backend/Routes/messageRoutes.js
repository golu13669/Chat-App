const express=require('express')
const { sendMessage, allMessage } = require('../Controllers/messageController')
const {protect}=require('../Middleware/authMiddleware')
const multer=require('multer');

const router=express.Router()

const avatar=multer({
    limits:5000000,
    fileFilter(res,file,cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb(new Error("The file must be a image"))
        }

        cb(undefined,true)
    }
})


router.route('/').post(protect,avatar.single('content'),sendMessage)
router.route('/:chatId').get(protect,allMessage)


module.exports=router
