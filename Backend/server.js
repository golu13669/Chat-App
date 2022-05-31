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


dbConnect( )
const app=express()
dotenv.config()

const port=process.env.PORT || 4000

app.use(express.json())

app.use('/api/user',UserRoute)
app.use('/api/chat',ChatRoute)
app.use('/api/message',MessageRoute)

//send invite
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.user, // generated ethereal user
      pass: process.env.password, // generated ethereal password
    },
});

app.post('/api/invite',protect,(req,res)=>{
    const email=req.body.email

    transporter.sendMail({
        from: '"Chat App" <devtestmern32@gmail.com>', // sender address
        to: email, // list of receivers
        subject: "Chat App Invite", // Subject line
        html:`<h3>Chat App Invite</h3>
            <span>Please click in the below link to register in Chat App</span>
            <a href="http://localhost:3000" method=GET>link text</a>
        `
      },(error,data)=>{
          if(error)
          {
            res.status(400)
            throw new Error(error)
          }
        //   console.log("Error occured : ",error)

          res.json({
              Status:"Success"
          })

        //   console.log("Email sent : ",data.response)
      });
    
      
})

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