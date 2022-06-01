const Asynchandler=require('express-async-handler')
const transporter= require('../Config/Nodemailer')
const Chat=require('../Models/chatModel')
const User = require('../Models/userModel')

//To access or create a new chat -POST method
const accessChat=Asynchandler(async(req,res)=>{
    const{userID}=req.body

    if(!userID){
        console.log('UserId param not send with the request')
        return res.sendStatus(404)
    }

    var isChat = await Chat.find({
        isGroupChat:false,
        $and:[
            {users:{$elemMatch:{$eq:req.user._id}}},
            {users:{$elemMatch:{$eq:userID}}}
        ]
    }).populate('users','-password')
      .populate('lastestMsg')
    
    isChat=await User.populate(isChat,{   
        path:'lastestMsg.sender',
        select:'name picture email'
    })

    console.log("isChat : ",isChat)

    if(isChat.length>0)
    {
        res.send(isChat[0])
    }else{
        var chatData={
            chatName:'sender',
            isGroupChat:false,
            users:[
                req.user.id,  //this should be first cause the chatlogics in frontend work accd to this
                userID
            ]
        }

        try {
            const createdChat=await Chat.create(chatData)

            const fullChat=await Chat.find({_id:createdChat._id})
            .populate('users','-password')

            res.status(200).send(fullChat)
        } catch (error) {
            res.status(400)
            throw new Error(error.message)
        }
    }
})

//To Fetch all the chat of the logged in user -GET method
const fetchChat =Asynchandler(async(req,res)=>{
    try {
        Chat.find({users:{$elemMatch:{$eq:req.user._id}}})
        .populate('users','-password')
        .populate('groupAdmin','-password')
        .populate("lastestMsg")
        .sort({updatedAt:-1})
        .then(async(result)=>{
            result= await User.populate(result,{   //yet to understand
                path:'lastestMsg.sender',
                select:'name picture email'
            })

            res.status(200).send(result)
        })
    } catch (error) {
        res.status(400)
        throw new Error(error.message)
    }
})

//To create a new group chat -POST method
const createGroupChat=Asynchandler(async(req,res)=>{
    if(!req.body.users||!req.body.name)
    {
        return res.status(400).send("Please fill all the fields")
    }

    var users=JSON.parse(req.body.users)

    if(users.length<2)
    {
        return res.status(400)
        .send("More than 2 users are required to create a group chat")
    }

    users.push(req.user)

    try {
        const groupChat= await Chat.create({
            chatName:req.body.name,
            users:users,
            isGroupChat:true,
            groupAdmin:req.user
        })

        const fullGroupChat= await Chat.find({_id:groupChat._id})
        .populate('users','-password')
        .populate('groupAdmin','-password')


        res.status(200).json(fullGroupChat)

    } catch (error) {
        res.status(400)
        throw new Error(error.message)
    }

})

//To rename the groupName -PUT method
const renameGroup=Asynchandler(async(req,res)=>{
    const {chatId,chatName}=req.body

    const updatedChat=await Chat.findByIdAndUpdate(
        chatId,
        {
            chatName,
        },
        {
            new:true   //to return the updated value
        }
    )
    .populate('users','-password')
    .populate('groupAdmin','-password')

    if(!updatedChat){
        res.status(404)
        throw new Error("Chat not found")
    }else{
        res.status(200).json(updatedChat)
    }

})

//to Add new user to the group -PUT method
const addToGroup=Asynchandler(async(req,res)=>{
    const {chatId,userId}=req.body

    const added = await Chat.findByIdAndUpdate(
        chatId,
        {
            $push:{users:userId}
        },
        {
            new:true
        }
    ).populate('users','-password')
    .populate('groupAdmin','-password')

    if(!added){
        res.status(404)
        throw new Error("Chat not found")
    }else{
        res.status(200).json(added)
    }
})

//to remove  user to the group -PUT method
const removeFromGroup=Asynchandler(async(req,res)=>{
    const {chatId,userId}=req.body

    const removed = await Chat.findByIdAndUpdate(
        chatId,
        {
            $pull:{users:userId}
        },
        {
            new:true
        }
    ).populate('users','-password')
    .populate('groupAdmin','-password')

    if(!removed){
        res.status(404)
        throw new Error("Chat not found")
    }else{
        res.status(200).json(removed)
    }
})


const invite=Asynchandler(async(req,res)=>{
    const email=req.body.email
    console.log(email)

    transporter.sendMail({
        from: '"Chat App" <devtestmern32@gmail.com>', // sender address
        to: email, // list of receivers
        subject: "Chat App Invite", // Subject line
        html:`<h3>Chat App Invite</h3>
            <span>Please click in the below link to register in Chat App</span>
            <a href="${process.env.URL}">link text</a>
        `
      },(error,data)=>{
          if(error)
          {
            console.log("Error occured : ",error)
            res.status(400)
            throw new Error(error)
          }

          res.json({
              Status:"Success"
          })

          console.log("Email sent : ",data.response)
      });
    
      
})

module.exports={
    accessChat,
    fetchChat,
    createGroupChat,
    renameGroup,
    addToGroup,
    removeFromGroup,
    invite
}