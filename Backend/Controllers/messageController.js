const Asynchandler=require('express-async-handler')
const Chat=require('../Models/chatModel')
const Message = require('../Models/messageModel')
const User = require('../Models/userModel')


//POST method to post  the messages from the user


const sendMessage=Asynchandler(async(req,res)=>{
    const loginUser=req.user
    const {content,chatId}=req.body
    const file=req.file

    if((!chatId||!content)&&!file)
    {
        // console.log("Invalid data passed into the request")
        return res.sendStatus(400)
    }

    var newMessage={
        sender:loginUser._id,
        content:!content?file:content,
        chat: chatId
    }

    try {

        var message=await Message.create(newMessage)

        message = await message.populate("sender","name picture")
        message = await message.populate("chat")
        message = await User.populate(message,{
            path:"chat.users",
            select:"name picture email"
        })


        await Chat.findByIdAndUpdate(chatId,{
            lastestMsg:message
        })


        res.status(200).json(message)
    } catch (error) {
        res.status(400)
        throw new error(error.message)
    }
})

//GET method to get all the messages from a particular chat
const allMessage=Asynchandler(async(req,res)=>{
    try {
        const message = await Message.find({chat:req.params.chatId})
        .populate("sender","name picture email")
        .populate('chat')

        res.status(200).json(message)
    } catch (error) {
        res.status(400)
        throw new error(error.message)
    }
})




module.exports={sendMessage,allMessage
}
