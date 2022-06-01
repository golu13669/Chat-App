const express=require('express')
const {instrument} =require('@socket.io/admin-ui')
const dbConnect=require('./Config/db')
const color=require('colors')
const UserRoute=require('./Routes/UserRoute')
const ChatRoute=require('./Routes/ChatRoute')
const MessageRoute=require('./Routes/messageRoutes')
const dotenv=require('dotenv')
const nodemailer=require('nodemailer')
const {protect}=require('./Middleware/authMiddleware')
const{notFound,errorHandler}=require('./Middleware/errorMiddleware')
const path=require('path')
const { transporter } = require('./Config/Nodemailer')


dbConnect( )
const app=express()
dotenv.config()

const port=process.env.PORT || 4000

app.use(express.json())

app.use('/api/user',UserRoute)
app.use('/api/chat',ChatRoute)
app.use('/api/message',MessageRoute)

//---------------------Deployment------------------------

const _dirname1=path.resolve()
if(process.env.NODE_ENV==='production')
{
    app.use(express.static(path.join(_dirname1,"/frontend/build")))
}else{
    app.get('/',(req,res)=>{
        res.send("API is running successfully")
    })
}

//---------------------Deployment------------------------


app.use(notFound)
app.use(errorHandler)


const server=app.listen(port,()=>{
    console.log(`server is running on port ${port}`.yellow.bold)
})

//start socket.io

const io=require('socket.io')(server,{
    pingTimeOut:60000,
    cors:{
        origin:["http://localhost:3000","https://admin.socket.io/"],
    },
    maxHttpBufferSize: 1e8, 
})


io.on('connection',(socket)=>{
    // console.log('connected to socket id ')

    socket.on('setup',(userData)=>{
        socket.join(userData._id)
        // console.log("joined  : ",userData._id)
        socket.emit("connected")
    })

    socket.on('join chat',(room)=>{
        // console.log("roined")
        socket.join(room)
        // console.log("user join room : ",room)
    })

    socket.on('new message',(newMsgRecieved)=>{
        var chat=newMsgRecieved.chat

        if(!chat.users) return console.log("Chat users are not defined")

        chat.users.forEach((user) => {
            if(user._id === newMsgRecieved.sender._id)  
            {
                return
            }
            socket.to(user._id).emit("messages recieved", newMsgRecieved)
        })
    })

    socket.off('setup',()=>{
        console.log("User Disconnected")
        socket.leave(userData._id)
    })
})

instrument(io,{auth:false})