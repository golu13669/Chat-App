 const Asynchandler=require('express-async-handler')
 const User=require('../Models/userModel')
 const generateToken=require('../Config/generateToken')


//api/user -- POST method
const registerUser=Asynchandler(async(req,res)=>{
     const{name,email,password,pic}=req.body 

     if(!name||!email||!password){
         res.status(400)
         throw new Error('Enter all the required field')
    }
    
    const userExist=await User.findOne({email})

    if(userExist){
        res.status(400)
        throw new Error('User already exits')
   }

   const user=await User.create({
       name,
       email,
       password,
       picture:pic,
    })
    
    if(user)
    {
        res.status(201).json({
            _id:user.id,
            name:user.name,
            email:user.email,
            pic:user.picture,
            token:generateToken(user.id)
       })
   }else{
      res.status(400)
      throw new Error('Failed to create user') 
   }
 })


//api/user/login -- POST method
const authUser=(Asynchandler(async(req,res)=>{
    const{email,password}=req.body

    const user=await User.findOne({email})

    if(user && (await user.matchPassword(password)))
    {
        res.status(201).json({
            _id:user.id,
            name:user.name,
            email:user.email,
            pic:user.picture,
            token:generateToken(user.id)
       })
   }else{
      res.status(400)
      throw new Error('Invalid email or passsword') 
   }
}))


//api/user -- GET method
const allUsers=Asynchandler(async(req,res)=>{
    const keyword=req.query
    ?{
        $or:[
            {name:{$regex:req.query.search , $options:'i'}},
            {email:{$regex:req.query.search , $options:'i'}}
        ]
    }
    :{};

    const users=await User.find(keyword).find({_id:{$ne:req.user._id}})

    res.send(users);
})

module.exports={registerUser,authUser,allUsers}