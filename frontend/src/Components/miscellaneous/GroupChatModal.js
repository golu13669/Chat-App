import { Box, Button, FormControl, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure, useToast } from '@chakra-ui/react'
import axios from 'axios'
import React, { useState } from 'react'
import { useChatState } from '../../Context/ChatProvider'
import UserBadgeItem from '../UserAvatar/UserBadgeItem'
import UserListItem from '../UserAvatar/UserListItem'

const GroupChatModal = ({children}) => {

    const { isOpen, onOpen, onClose } = useDisclosure()
    const[groupChatName,setGroupChatName]=useState()
    const[selectedUsers,setSelectedUsers]=useState([])
    const[search,setSearch]=useState("")
    const[searchResult,setSearchResult]=useState([])
    const[loading,setLoading]=useState(false)

    const toast =useToast()
    const{user,chats,setChats}=useChatState();

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
        }
    }

    const handleSubmit=async()=>{

        if(!groupChatName||!selectedUsers)
        {
            toast({
                title:"Please fill the details",
                status:"warning",
                duration:5000,
                isClosable:true,
                position:"top"
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
            const {data}= await axios.post('/api/chat/group',{
                name:groupChatName,
                users:JSON.stringify(selectedUsers.map((user)=>user._id)),
            },
            config)  //data is an array with one object so we are passing the object

            // console.log("new group data : ",data[0])

            setChats([data[0],...chats])
            onClose();
            toast({
                title:"New Group Chat Created!",
                status:"success",
                duration:5000,
                isClosable:true,
                position:"bottom"
              })
              setSelectedUsers([])
              setLoading(false)
              setSearchResult([])
              
        } catch (error) {
            toast({
                title:"Failed to create chat",
                status:"error",
                duration:5000,
                isClosable:true,
                position:"bottom "
              })
              return;
        }
    }

    const handleGroup=(userToAdd)=>{
        
        if(selectedUsers.includes(userToAdd)){
            toast({
                title:"User Already Added",
                status:"warning",
                duration:5000,
                isClosable:true,
                position:"top"
              })
              return; 
        }

        setSelectedUsers([...selectedUsers, userToAdd])
    }

    const handleDelete=(userToDelete)=>{
        setSelectedUsers(
            selectedUsers.filter(user=>user._id!==userToDelete._id)
        )
    }

  return (
    <>
        <span onClick={onOpen}>{children}</span>

        <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
            <ModalHeader
                fontSize={'35px'}
                fontFamily='Work sans'
                display={'flex'}
                justifyContent='center'
            >
                Create Group Chat 
            </ModalHeader>

            <ModalCloseButton />

            <ModalBody
                d='flex'
                flexDir={'column'}
                alignItems='center'
            >
                <FormControl>
                    <Input 
                        placeholder='ChatName' 
                        mb={3}  type='text' 
                        onChange={(e)=>{setGroupChatName(e.target.value)}} 
                    />
                </FormControl>
                <FormControl>
                    <Input 
                        placeholder='Add Users eg: Polly,Rohan,Jennie' 
                        mb={1}  type='text' 
                        onChange={(e)=>{handleSearch(e.target.value)}} 
                    />
                </FormControl>
                <Box d='flex' flexWrap='wrap' w={"100%"}>
                    {selectedUsers?.map((user)=>(
                        <UserBadgeItem key={user._id} user={user}
                        handleFunction={()=>handleDelete(user)}/>
                    ))}
                </Box>

                {loading?<div>Loading</div>:(
                    searchResult?.slice(0,4)
                    .map((user)=>
                    (
                        <UserListItem 
                            key={user._id} user={user} 
                            handleFunction={()=>handleGroup(user)}
                        />
                    ))
                    )}
            </ModalBody>

            <ModalFooter>
            <Button colorScheme='blue' onClick={handleSubmit}>
                 Create Chat
            </Button>
            </ModalFooter>
        </ModalContent>
        </Modal>
    </>
  )
}

export default GroupChatModal