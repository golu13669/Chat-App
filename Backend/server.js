const express=require('express')
const {instrument} =require('@socket.io/admin-ui')
const dbConnect=require('./Config/db')
const color=require('colors')
const UserRoute=require('./Routes/UserRoute')
const ChatRoute=require('./Routes/ChatRoute')
const MessageRoute=require('./Routes/messageRoutes')
const dotenv=require('dotenv')
const{notFound,errorHandler}=require('./Middleware/errorMiddleware')



dbConnect()
const app=express()
dotenv.config()

const port=process.env.PORT || 8000

app.use(express.json())

app.use('/api/user',UserRoute)
app.use('/api/chat',ChatRoute)
app.use('/api/message',MessageRoute)


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
    console.log(socket.id)

    socket.on('setup',(userData)=>{
        socket.join(userData._id)
    })

    socket.on('join chat',(room)=>{
        socket.join(room)
    })

    socket.on('new message',(newMsgRecieved)=>{
        var chat=newMsgRecieved.chat

        if(!chat.users) return console.log("Chat users are not defined")

        chat.users.forEach((user) => {
            if(user._id === newMsgRecieved.sender._id)  
            {
                return
            }
            socket.in(user._id).emit("messages recieved", newMsgRecieved)
        })
    })

})

instrument(io,{auth:false})