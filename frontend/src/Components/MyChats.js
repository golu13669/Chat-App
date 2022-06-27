import { AddIcon } from '@chakra-ui/icons'
import { Box, Button, Stack, Text, useToast } from '@chakra-ui/react'
import axios from 'axios'
import React, { useEffect} from 'react'
import { getSender } from '../Config/ChatLogics'
import { useChatState } from '../Context/ChatProvider'
import ChatLoading from './ChatLoading'
import GroupChatModal from './miscellaneous/GroupChatModal'

const MyChats = ({fetchAgain,loggedUser}) => {
  

  const {user,selectedChat,setSelectedChat,chats,setChats}=useChatState()

  const toast=useToast()

  const chatFetch=async()=>{
    try {
      const config=
      {
        headers:{
          Authorization:`Bearer ${user.token}`
        }
      }

      const {data}= await axios.get(`/api/chat`,config)
      setChats(data)
      
    } catch (error) {
      toast({
        title:"Error Occured",
        description:"Failed to load the chats",
        status:"error",
        duration:5000,
        isClosable:true,
        position:"bottom-left"
      })
    }
  }

  useEffect(()=>{
    chatFetch()
    // eslint-disable-next-line
  },[fetchAgain])
  

  return (
    <Box
      d={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg="white"
      w={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <Box
        // border='1px solid red'
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily="Work sans"
        d="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
        >
        My Chats
        <GroupChatModal>
          <Button
            d="flex"
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={<AddIcon/>}
            >
            New Group Chat
          </Button>
        </GroupChatModal>
      </Box>
      <Box
        d='flex'
        flexDir={'column'}
        p={3}
        w={'100%'}
        h='100%'
        borderRadius='lg'
        overflowY='hidden'
      >
        {chats?(
        <Stack overflowY='scroll'>
          {chats.map((chat)=>(
            <Box
              key={chat._id}
              onClick={()=>setSelectedChat(chat)}
              cursor='pointer'
              bg={selectedChat===chat?'purple':'#e8e8e8'}
              color={selectedChat===chat?'white':'black'}
              _hover={{
                background:"#f542dd",
                color:'black'
            }}
              px={3}
              py={2}
              borderRadius='lg'
            >
              <Text key={chat._id} >
                {console.log(chat)}
                {!chat.isGroupChat?
                getSender(loggedUser,chat.users)
                :chat.chatName}
              </Text>
              {chat.lastestMsg && (
                <Text fontSize="xs">
                  <b>{chat.lastestMsg.sender.name} : </b>
                  {!chat.lastestMsg.content.originalname?chat.lastestMsg.content.substring(0, 51):chat.lastestMsg.content.originalname}
                </Text>
              )}
            </Box>
          ))}
        </Stack>
        ):(
          <ChatLoading/>
        )}
      </Box>
    </Box>
  )
}

export default MyChats