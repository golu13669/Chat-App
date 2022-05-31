import React, { useEffect, useRef, useState } from 'react'
import { useChatState } from '../Context/ChatProvider'
import { Box,FormControl, IconButton, Input, Spinner, Text, useToast } from '@chakra-ui/react'
import { ArrowBackIcon, AttachmentIcon } from '@chakra-ui/icons'
import { getSender,getSenderFull } from '../Config/ChatLogics'
import ProfileModel from '../Components/miscellaneous/ProfileModel'
import UpdateGroupChatModal from './miscellaneous/UpdateGroupChatModal'
import axios from 'axios'
import './styles.css'
import ScrollableChat from './ScrollableChat';
import {Buffer} from 'buffer';
import io from 'socket.io-client'
import FilePreview from './FileModal/FilePreview'

const ENDPOINT=["http://localhost:4000"]
var socket,selectedChatCompare;



const SingleChat = ({fetchAgain,setFetchAgain}) => {

  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [newMessage, setNewMessage] = useState("")
  const [file, setFile] = useState("")
  const inputFile = useRef(null) 


  const {user,selectedChat,setSelectedChat}=useChatState()


  const toast=useToast()

  //file preview

  useEffect(()=>{
    setFile(null)
  },[selectedChat])

  //  socket use effect
  useEffect(()=>{

    socket=io.connect(ENDPOINT)
    socket.emit('setup',user)
    // eslint-disable-next-line 
  },[])


    const onButtonClick = () => {
      console.log("Button click")
     inputFile.current.click();
    };


    const fetchMessages=async(e)=>{
      if(!selectedChat) 
        return;

      try {
        const config={
          headers:{
            Authorization:`Bearer ${user.token}`
          }
        }
        setLoading(true)

        const{data}=await axios.get(`/api/message/${selectedChat._id}`,config)
        console.log("fetch : ",data)

        setMessages(data)
        setLoading(false)
        socket.emit('join chat',selectedChat._id)

      } catch (error){
        toast({
          title:"Error Occured",
          description:"Failed to load the messages",
          status:"error",
          duration:5000,
          isClosable:true,
          position:"bottom"
        })
      }
    }

    useEffect(()=>{
      fetchMessages()
      selectedChatCompare=selectedChat
       // eslint-disable-next-line 
    },[selectedChat])

    const sendMessage=async(e)=>{
    if(e.key==='Enter' && newMessage){
    
      try {
        const config={
          headers:{
            "Content-type":"application/json",
            Authorization:`Bearer ${user.token}`
          }
          
        }
        
        setNewMessage("")

        const{data}=await axios.post('/api/message',{
          content:newMessage,
          chatId:selectedChat._id
        },config)

        console.log("msg : ",data)
        
        socket.emit("new message",data)
        setFetchAgain(!fetchAgain)
        setMessages([...messages,data])

        } catch (error) {
          toast({
            title:"Error Occured",
            description:"Failed to send message",
            status:"error",
            duration:5000,
            isClosable:true,
            position:"bottom"
          })
        }
      }
    }
    
    const submitImage=async()=>
    {
      const formdata=new FormData()
      formdata.append("content",file);
      formdata.append("chatId",selectedChat._id)
          
      try{
          const config={
              headers:{
                  Authorization:`Bearer ${user.token}`
              }
            }
            
            setFile('')
            let {data}=await axios.post('/api/message',formdata,config)
            
            //buffering the images
            const bufferread=data.content.buffer.data
            const newBuffer=new Buffer.from(bufferread).toString("base64")
            const newContent={...data.content,buffer:newBuffer}
            
            data={...data,content:newContent}
            
            console.log(data)
            
          socket.emit("new message",data)
          setMessages([...messages,data])
          setFetchAgain(!fetchAgain)

      }catch(error)
      {
        console.log(error)
          toast({
              title:"Error Occured",
              description:"Not able to send",
              status:"error",
              duration:5000,
              isClosable:true,
              position:"bottom"
            })
      }
  }

    const typingHandler=(e)=>{
      setNewMessage(e.target.value)
    }
    
    useEffect(()=>{
      socket.on('messages recieved',(newMsgRecieved)=>{
        console.log("messages recieve  : ",newMsgRecieved)
        setFetchAgain(!fetchAgain)
        if(!selectedChatCompare||selectedChatCompare._id !== newMsgRecieved.chat._id){
          
        }else{
          setMessages([...messages,newMsgRecieved])
        }
      })
    })

    return (
      <>
      {selectedChat?(
        <>
          <Text
            fontSize={{base:'28px',md:'30px'}}
            pb={3}
            px={2}
            w='100%'
            fontFamily={'Work sans'}
            d='flex'
            justifyContent={{base:'space-between'}}
            alignItems={'center'}
          >
            <IconButton
            d={{base:'flex',md:'none'}}
            icon={<ArrowBackIcon/>}
            onClick={()=>setSelectedChat('')}
            />
            {!selectedChat.isGroupChat?
              (
                <>
                  {getSender(user,selectedChat.users)}
                  <ProfileModel user={getSenderFull(user,selectedChat.users)}/>
                </>

              ):(
                <>
                  {selectedChat.chatName.toUpperCase()}
                  <UpdateGroupChatModal fetchAgain={fetchAgain} 
                  setFetchAgain={setFetchAgain} fetchMessages={fetchMessages}/>
                </>
              )}
          </Text>
          <Box
            d='flex'
            flexDir={'column'}
            justifyContent='flex-end'
            p={3}
            bg={'#e8e8e8'}
            w='100%'
            h='100%'
            overflowY='hidden'
            borderRadius='lg'
          >
            {loading?
              <Spinner
                size='xl'
                alignSelf={'center'}
                w={20}
                h={20}
                margin='auto'
              />
            :(<div className='messages'>

              {file?
              (<FilePreview file={file} setFile={setFile} submitImage={submitImage} />):
              (<ScrollableChat messages={messages}/>)}

            </div>)
            }

            <FormControl onKeyDown={sendMessage} display='flex'>
              <input type="file" id="file" name="file" ref={inputFile} style={{display: 'none'}} onChange={(e)=>{setFile(e.target.files[0])}}/>
              <IconButton
                onClick={onButtonClick}
                colorScheme='teal'
                icon={<AttachmentIcon/>}
                mr='2px'
                />

              <Input
                variant={'filled'}
                bg="#e8e8e8"
                placeholder='Enter A Message...'
                onChange={typingHandler}
                value={newMessage} 
              />
              
            </FormControl>

          </Box>
        </>
      ):(
        <Box
          d='flex'
          justifyContent='center'
          alignItems={'center'}
          h={'100%'}
        >
          <Text fontFamily={'Work sans'} pb={3} fontSize='3xl'>
            Click on a User to start chatting
          </Text>
        </Box>
      )}
    </>
  )
}


export default SingleChat;