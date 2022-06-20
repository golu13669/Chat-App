const Asynchandler=require('express-async-handler')
const User=require('../Models/userModel')
const bcrypt=require('bcryptjs')



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

    try{
        const user=await User.create({
            name,
            email,
            password,
            picture:pic,
         })

        const token=await user.generateToken()
        // console.log(token)
         
         if(user)
         {
            res.status(201).json({
                _id:user.id,
                name:user.name,
                email:user.email,
                pic:user.picture,
                token
            })
        }
        else
        {
            res.status(400)
            throw new Error('Failed to create user') 
        }
    }
    catch(e)
    {
        res.status(400)
        throw new Error(e)
    }
   
    
 })

//api/user/login -- POST method
const authUser=(Asynchandler(async(req,res)=>{
    const{email,password}=req.body

    const user=await User.findOne({email})

    const token=await user.generateToken()

    if(user && (await user.matchPassword(password)))
    {
        res.status(201).json({
            _id:user.id,
            name:user.name,
            email:user.email,
            pic:user.picture,
            token
       })
   }else{
      res.status(400)
      throw new Error('Invalid email or passsword') 
   }
}))


//log-out ser
const logOut=(Asynchandler(async(req,res)=>{
    // console.log("logout : ",req.token)
    try{
            req.user.tokens=req.user.tokens.filter((token)=>{
            return token.token!==req.token
        })
        await req.user.save()
        res.send()
    }catch(e)
    {
        res.status(500).send(e)
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

//password change 
const changePass=Asynchandler(async(req,res)=>{

    const {password , cpassword} = req.body;

    if(password && cpassword ){
        if(password !==cpassword){
                res.send({"message" : "new pass not match to cpass"})
        }
    else{
        const salt = await bcrypt.genSalt(10);
        const hashpass = await bcrypt.hash(password , salt);
        await User.findByIdAndUpdate(req.user._id, {$set : {password: hashpass }})
        res.send({"status" : "sucess" , "message" : "password change sucessfully"})
    }
}
    else{
        res.send({"status" : "failure" , "message" : "pass not enter"})
    }
   
})

module.exports={registerUser,authUser,allUsers ,changePass,logOut}
