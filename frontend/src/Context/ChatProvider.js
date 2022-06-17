import React,{createContext, useContext, useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';

const ChatContext=createContext()

const ChatProvider=({children})=>{
    const[user,setUser]=useState()
    const[selectedChat,setSelectedChat]= useState()
    const[chats,setChats]=useState([])
    const[notification, setNotification] = useState([])
    
    const navigate=useNavigate()
    
    useEffect(()=>{
        const userInfo=JSON.parse(localStorage.getItem('userInfo'))
        
        if(!userInfo){
            navigate('/')
        }
        
        setUser(userInfo)
    },[navigate])
    
    
    return(
        <ChatContext.Provider value={{user,setUser,selectedChat,setSelectedChat,chats,setChats,notification, setNotification}}> 
            {children}
        </ChatContext.Provider>
    )
}

export const useChatState=()=> {   //It should to start with a capital letter to specify that this  function is Custom react hooks
    return useContext(ChatContext)
}

export default ChatProvider;