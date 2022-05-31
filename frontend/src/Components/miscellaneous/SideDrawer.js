import { Avatar,Box, Button, Drawer, DrawerBody, DrawerContent, DrawerHeader, DrawerOverlay, Input, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Spinner, Text, Tooltip, useDisclosure, useToast } from '@chakra-ui/react'
import {ChevronDownIcon } from '@chakra-ui/icons'
import React, { useState } from 'react'
import { useChatState } from '../../Context/ChatProvider'
import ProfileModel from './ProfileModel'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import ChatLoading from '../ChatLoading'
import UserListItem from '../UserAvatar/UserListItem'
import InviteModal from './InviteModal'
// import { getSender } from '../../Config/ChatLogics'
// import NotificationBadge from 'react-notification-badge';
// import {Effect} from 'react-notification-badge';

const SideDrawer = () => {

  const { isOpen, onOpen, onClose } = useDisclosure()
  const[search,setSearch]=useState("")
  const[searchResult,setSearchResult]=useState([])
  const[loading,setLoading]=useState(false)
  const[loadingChat,setLoadingChat]=useState(false)

  const {user,setSelectedChat,chats,setChats
    // ,notification, setNotification
  }=useChatState()

  const navigate=useNavigate()
  const toast=useToast();

  const logoutHandler=()=>{
    localStorage.removeItem('userInfo')
    navigate('/')
  }

  const handleSearch=async()=>{
    if(!search){
      toast({
        title:"Please enter something to search",
        status:"warning",
        duration:5000,
        isClosable:true,
        position:"top-left"
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

      const {data}= await axios.get(`/api/user?search=${search}`,config)
      
      setLoading(false)
      setSearchResult(data)    
    } catch (error) {
      toast({
        title:"Failed Occured",
        description:"Failed to load the search result",
        status:"error",
        duration:5000,
        isClosable:true,
        position:"bottom-left"
      })
    }
  }

  //create a new chat
  const accesschat=async(userID)=>{
    try {
      setLoadingChat(true)

      const config={
      headers:{
        "Content-type":"Application/json",
        Authorization:`Bearer ${user.token}`
        }
      }

      const {data}=await axios.post('/api/chat',{userID},config)

      if(!chats.find((c)=>c._id===data._id)){
        setChats(data,...chats)
      }
      setSelectedChat(data)
      setLoadingChat(false)
      onClose() //close the side drawer
      
    } catch (error) {
      toast({
        title:"Error fetching the user",
        description:error.message,
        status:"error",
        duration:5000,
        isClosable:true,
        position:"bottom-left"
      })
    }
  }


  const handleKeyPress=(e)=>{
    if(e.key==='Enter')
    {
      handleSearch()
    }
  }

  return (
    <>
      <Box
      d="flex"
      justifyContent="space-between"
      alignItems="center"
      bg="white"
      p="5px 10px 5px 10px"
      width="100%"
      borderWidth="5px"
      >
        <Tooltip label="Search Users to Chat" hasArrow placement='bottom-end'>
          <Button variant="ghost">
            <i className="fas fa-search" onClick={onOpen}></i>
            <Text
              d={{base:"none",md:"flex"}}
              px="4"
              onClick={onOpen}
            >
              Search User
            </Text>
          </Button>
        </Tooltip>

        <Text fontSize="2xl" fontFamily="work sans">
          CHAT - APP
        </Text>
        <div>
          <InviteModal/>
          {/* <Menu>
            <MenuButton p={1}>
              <NotificationBadge
                count={notification.length}
                effect={Effect.SCALE}
              />
              <Badge variant="solid" bg="red" borderRadius='1000000px'>
                {notification.length===0?"":notification.length}
              </Badge>
            </MenuButton>
              <MenuList pl={2}>
                {console.log("Notification length: ",notification.length+" notification : "+notification)}
                {!notification.length && "No New Messages"}
                {notification.map((notif) => (
                  <MenuItem
                    key={notif._id}
                    onClick={() => {
                      setSelectedChat(notif.chat);
                      setNotification(notification.filter((n) => n !== notif));
                    }}>
                    {notif.chat.isGroupChat
                      ? `New Message in ${notif.chat.chatName}`
                      : `New Message from ${getSender(user, notif.chat.users)}`}
                    </MenuItem>
                  ))}
              </MenuList>
          </Menu> */}
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon/>} ml={4}>
              <Avatar size='sm' cursor='pointer' name={user.name} src={user.pic}/>
            </MenuButton>
            <MenuList>
              <ProfileModel user={user}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModel>
              <MenuDivider/>
              <MenuItem onClick={logoutHandler}>Log Out</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>

      <Drawer placement='left' onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay/>
        <DrawerContent>
          <DrawerHeader borderBottomWidth='1px'>Search User</DrawerHeader>
          <DrawerBody>
            <Box d='flex' pb={2}>
              <Input
                placeholder='Enter the Email or Name'
                mr={2}
                value={search}
                onChange={(e)=>{setSearch(e.target.value)}}
                // onKeyDown={handleKeyPress}
                onKeyPress={handleKeyPress}
              />
              <Button onClick={handleSearch} >
                Go
              </Button>
            </Box>
              {loading?<ChatLoading/>:(
                searchResult?.map(user=>(
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={()=>accesschat(user._id)}
                  />
                ))
              )}
              {loadingChat&&<Spinner d='flex' ml={'auto'} />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  )
}

export default SideDrawer