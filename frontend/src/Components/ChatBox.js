import React from 'react'
import {Box} from '@chakra-ui/react'
import { useChatState } from '../Context/ChatProvider'
import SingleChat from './SingleChat'

const ChatBox = ({setFetchAgain,fetchAgain}) => {

  const {selectedChat}=useChatState()

  return (
    <Box
      d={{base:selectedChat?"flex":"none",md:'flex'}}
      flexDir='column'
      p={3}
      alignItems='center'
      w={{base:'100%',md:"68%"}}
      bg='white'
      borderRadius='lg'
      borderWidth='1px'
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>
    </Box>
  )
}

export default ChatBox