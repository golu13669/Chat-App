const Asynchandler=require('express-async-handler')
const User=require('../Models/userModel')
const generateToken=require('../Config/generateToken')
const bcrypt=require('bcryptjs')
const transporter = require('../Config/Nodemailer');


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
         
         if(user)
         {
            res.status(201).json({
                _id:user.id,
                name:user.name,
                email:user.email,
                pic:user.picture,
                token:generateToken(user.id)
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

const UseremailCheck = async(req,res)=>{
    const {email} = req.body;
    console.log(email)
    // console.log(transporter);
    const user = await User.findOne({email:email});
    console.log(user)
    if(user){
        // const secret = user._id + process.env.JWT_SECRET;
        const token = generateToken(user._id)
        var link = `http://localhost:3000/api/user/reset/${user._id}/${token}` ;
        // console.log(link);
        // console.log(user.email)
        // send email
    
        console.log("check");
        // var name = link;
        try{
            // console.log(link)
            let info = await transporter.sendMail({
                from : 'gourav14669@gmail.com' ,
                to : user.email,
                subject : "OnlineChat! -  password reset ink",
                html :`<a href=${link}> click here fast </a>`,
                           
            })
            console.log(link)
            console.log(info)
            res.json({"message" : "Password reset email send " , "email" : user.email})
        }
        
        catch(error){
            res.send({"message" : error.message})
        }
       
       

    }
    else{
        res.send({"message" : "email does not exist "})
    }
}

    const Userforgetpass = async (req,res)=>{
        console.log(req.body);
       
        const {password , confirmpassword} = req.body;
        const {id , token} = req.params;
        console.log("urls:" ,id , token );
        const user = await User.findById(id);
        const newSecret = user._id + process.env.JWT_SECRET;
        try {
            jwt.verify(token , newSecret);
        
        } catch (error) {
            console.log(error)
        }
        if(password && confirmpassword){
            if(password !== confirmpassword){
                res.send({"message" : "new pass not match to cpass"})
            }
            else{
                const salt = await bcrypt.genSalt(10);
            const hashpass = await bcrypt.hash(password , salt);
            await User.findByIdAndUpdate(user._id, {$set : {password: hashpass }})
            res.send({"status" : "sucess" , "message" : "password change sucessfully"})

            }
        }
        else{
            res.send("enter both pass");
        }
    }

module.exports={registerUser,authUser,allUsers ,changePass , UseremailCheck ,Userforgetpass }
