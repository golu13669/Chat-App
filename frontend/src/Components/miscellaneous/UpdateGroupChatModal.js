import { ViewIcon } from '@chakra-ui/icons'
import { Box, Button, FormControl, IconButton, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, useDisclosure, useToast } from '@chakra-ui/react'
import axios from 'axios'
import React, { useState } from 'react'
import { useChatState } from '../../Context/ChatProvider'
import UserBadgeItem from '../UserAvatar/UserBadgeItem'
import UserListItem from '../UserAvatar/UserListItem'

const UpdateGroupChatModal = ({fetchAgain,setFetchAgain,fetchMessages}) => {
    
    const { isOpen, onOpen, onClose } = useDisclosure()
    const {user,selectedChat,setSelectedChat}=useChatState()
    const [groupChatName, setGroupChatName] = useState("")
    const [search, setSearch] = useState("")
    const [searchResult, setSearchResult] = useState([])
    const [loading, setLoading] = useState(false)
    const [renameLoading, setRenameLoading] = useState(false)

    const toast=useToast()

    const handleAddUser=async(userToAdd)=>{
        if(selectedChat.users.find((user)=>user._id===userToAdd._id))
        {
            toast({
                title:"User Already Added",
                status:"warning",
                duration:5000,
                isClosable:true,
                position:"bottom"
              })
              return;
        }

        try {
            setLoading(true)

            const config={
                headers:{
                    Authorization:`Bearer ${user.token}`
                }
            }

            const{data}=await axios.put(`/api/chat/groupAdd`,
            {
                chatId:selectedChat._id,
                userId:userToAdd._id
            }
            ,config)

            console.log(data)

            setLoading(false)
            setSelectedChat(data)
            setFetchAgain(!fetchAgain)

        } catch (error) {
            toast({
                title:"Error Occured",
                description:error.response.data.message,
                status:"error",
                duration:5000,
                isClosable:true,
                position:"bottom"
              })
              setLoading(false)
        }
    }

    const handleRemove=async(userToRemove)=>{
        if(selectedChat.groupAdmin._id!==user._id&&userToRemove._id!==user.Id)
        {
            toast({
                title:"Only Admin can remove someone",
                status:"warning",
                duration:5000,
                isClosable:true,
                position:"bottom"
              })
              return;
        }

        try {
            setLoading(true)

            const config={
                headers:{
                    Authorization:`Bearer ${user.token}`
                }
            }

            const{data}=await axios.put(`/api/chat/groupRemove`,
            {
                chatId:selectedChat._id,
                userId:userToRemove._id
            }
            ,config)

            console.log(data)

            userToRemove._id===user._id?setSelectedChat():setSelectedChat(data)
            setLoading(false)
            fetchMessages()
            setFetchAgain(!fetchAgain)

        } catch (error) {
            toast({
                title:"Error Occured",
                description:error.response.data.message,
                status:"error",
                duration:5000,
                isClosable:true,
                position:"bottom"
              })
              setLoading(false)
        }
    }

    const handleRename=async()=>{
        if(!groupChatName){
            return
        }
        try{
            setRenameLoading(true)

            const config={
                headers:{
                    Authorization:`Bearer ${user.token}`
                }
            }

            const{data}=await axios.put(`/api/chat/rename`,
            {
                chatId:selectedChat._id,
                chatName:groupChatName
            }
            ,config)

            console.log(data)
            setSelectedChat(data)
            setFetchAgain(!fetchAgain)
            setRenameLoading(false)
        }catch(error){
            toast({
                title:"Error Occured",
                description:"Failed to load the Search results",
                status:"error",
                duration:5000,
                isClosable:true,
                position:"bottom"
              })
            setRenameLoading(false)
        }

        setGroupChatName(' ')
    }

    const handleSearch=async(query)=>{
        setSearch(query)
        if(!query)
        {
            return;
        }

        try {
            setLoading(true)
            const config={
                headers:{
                    Authorization:`Bearer ${user.token}`
                }
            }

            const{data}=await axios.get(`/api/user?search=${search}`,config)
            // console.log(data)
            setLoading(false)
            setSearchResult(data)

        } catch (error) {
            toast({
                title:"Error Occured",
                description:"Failed to load the Search results",
                status:"error",
                duration:5000,
                isClosable:true,
                position:"bottom-left"
              })
            setLoading(false)
        }
    }


  return (
      <>
        <IconButton
            d={{base:'flex'}}
            icon={<ViewIcon/>}
            onClick={onOpen}
        />

        <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
            <ModalHeader
                fontFamily={'Work sans'}
                fontSize='36px'
                d='flex'
                justifyContent={'center'}
            >{selectedChat.chatName}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
                <Box  d='flex' flexWrap='wrap' w={"100%"} pb={3}>
                    {selectedChat.users.map(user=>(
                        <UserBadgeItem key={user._id} user={user}
                        handleFunction={()=>handleRemove(user)}/>
                    ))}
                </Box>
                <FormControl d='flex'>
                    <Input 
                        placeholder='Chat Name' mb={3}
                        value={groupChatName}
                        onChange={(e)=>setGroupChatName(e.target.value)}
                    />
                    <Button
                        ml={1}
                        variant='solid'
                        colorScheme={'teal'}
                        isLoading={renameLoading}
                        onClick={handleRename}
                    >
                        Update
                    </Button>
                </FormControl>

                <FormControl d='flex'>
                    <Input 
                        placeholder='Add User to Group' mb={1}
                        onChange={(e)=>handleSearch(e.target.value)}
                    /> 
                </FormControl>
                {loading?(
                    <Spinner size={'lg'}/>
                ):(
                    searchResult?.slice(0,4)
                    .map((user)=>
                    (
                        <UserListItem 
                            key={user._id} user={user} 
                            handleFunction={()=>handleAddUser(user)}
                        />
                    ))
                )}
            </ModalBody>

            <ModalFooter>
            <Button colorScheme='red'onClick={()=>handleRemove(user)}>
                Leave Group
            </Button>
            </ModalFooter>
        </ModalContent>
        </Modal>
      </>
  )
}

export default UpdateGroupChatModal