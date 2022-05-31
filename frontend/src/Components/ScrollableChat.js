import React from 'react'
import ScrollableFeed from 'react-scrollable-feed'
import { isLastMessage, isSameSender, isSameSenderMargin, isSameUser } from '../Config/ChatLogics'
import { Avatar, Tooltip } from '@chakra-ui/react'
import { useChatState } from '../Context/ChatProvider'
const ScrollableChat = ({messages}) => {

  const {user}=useChatState()

  return (
    <ScrollableFeed>
      {messages&& messages.map((msg,index)=>(
        <div style={{display:'flex'}} key={msg._id}>
          {(isSameSender(messages,msg,index,user._id)||
          isLastMessage(messages,index,user._id))
          &&(
            <Tooltip
              label={msg.sender.name}
              placement='bottom'
              hasArrow
            >
              <Avatar
                mt="7px"
                mr={1}
                size={'sm'}
                cursor='pointer'
                name={msg.sender.name}
                src={msg.sender.picture}
                />
            </Tooltip>
          )}
          <span style={{backgroundColor:`${
            msg.sender._id===user._id? "#BEE3F8":"#B9F5D0"
            }`,
            borderRadius:'20px',
            padding:'5px 15px',
            maxWidth:'75%',
            marginLeft:isSameSenderMargin(messages,msg,index,user._id),
            marginTop:isSameUser(messages,msg,index,msg._id)?3:10
          }}
          >
            {!msg.content.buffer?msg.content:
           <img src={`data:image/${msg.content.mimetype};base64,${msg.content.buffer.toString('base64')}`} alt = "attachment Selected" />}
          </span>
        </div>
      ))}
    </ScrollableFeed>
  )
}

export default ScrollableChat