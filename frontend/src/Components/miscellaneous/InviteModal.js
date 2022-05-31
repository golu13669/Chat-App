import { ExternalLinkIcon } from '@chakra-ui/icons';
import { Button, Modal, Text,ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure, IconButton, Input, useToast } from '@chakra-ui/react'
import axios from 'axios';
import React, { useState } from 'react';
import { useChatState } from '../../Context/ChatProvider';

const InviteModal = () => {
    const {isOpen, onOpen, onClose } = useDisclosure()
    const [invite, setInvite] = useState("")
    const{user}=useChatState();

    const toast =useToast()

    const sendInvite=async()=>{
      try{
        const config={
        headers:{
            Authorization:`Bearer ${user.token}`
          }
        }
        const response= await axios.post('/api/invite',{
            email:invite
        },config)
        console.log(response.data)
        if(response.data.Status==="Success")
        {
          toast({
            title:"Email sent",
            description:"The invite link has been sent",
            status:"success",
            duration:5000,
            isClosable:true,
            position:"bottom"
          })
        }
      }
    catch(error){
      console.log(error)
      toast({
        title:"Error Occured",
        description:"Failed to Send the invite",
        status:"error",
        duration:5000,
        isClosable:true,
        position:"bottom"
      })
    }
  }

  return (
    <>
      <IconButton onClick={onOpen} icon={<ExternalLinkIcon/>}/>

      <Modal size='lg' isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent
           h='300px' 
        >
          <ModalHeader
            fontSize="40px"
            fontFamily="Work sans"
            d='flex'
            justifyContent='center'
          >
             Send Invite
          </ModalHeader>
          <ModalCloseButton/>
          <ModalBody
            d='flex'
            flexDir='column'
            alignItems='center'
            justifyContent='space-between'
          >
            <Text
             fontSize={{base:'24px',md:'28px'}}
             fontFamily='Work sans'
            >
                Enter Email ID to Invite
            </Text>
            <Input
              color='teal'
              placeholder='Email ID'
              _placeholder={{ color: 'inherit' }}
              onChange={(e)=>setInvite(e.target.value)}
            />
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='teal' mr={3} onClick={()=>{sendInvite();onClose();}}>Send</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default InviteModal;