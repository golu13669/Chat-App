const jwt=require('jsonwebtoken')
const User = require('../Models/userModel')
const Asynchandler=require('express-async-handler');

const protect=Asynchandler(async(req,res,next)=>{
    let token;

    if(
        req.headers.authorization&&
        req.headers.authorization.startsWith('Bearer')
    ){
        try{
            token=req.headers.authorization.split(' ')[1]
            //decode token ID
            const decoded=jwt.verify(token,process.env.JWT_SECRET)

            req.user=await User.findById(decoded.id).select("-password") //return without the password 
          
            next();
        }
        catch(err){
            res.status(401)
            throw new Error('Not Authorized, token failed')
        }
    }
    
    if(!token)
    {
        res.status(401)
        throw new Error('Not Authorized, No Token')
    }

})

module.exports={protect};