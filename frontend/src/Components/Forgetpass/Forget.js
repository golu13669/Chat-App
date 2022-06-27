import { ViewIcon } from '@chakra-ui/icons'
import { FormControl, FormHelperText, FormLabel, IconButton, Input, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import { Button,   Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter,
    ModalHeader, ModalOverlay } from '@chakra-ui/react';
import axios from 'axios';

const Forget = ({children}) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [email , setemail] = useState("");
    const toast = useToast()
    const SubmitHandle =async()=>{
   
        if(!email) {
            toast({
                title: 'Please Enter Email.',
                description: "Fill Input",
                status: 'warning',
                duration: 2000,
                isClosable: true,
              })
              return 

        }
        const config = {
            headers: {
                "Content-Type": "application/json",
            }
        }
      const {data}  =  await axios.post('/api/user/userResetPass' , { email }, config);
      console.log(data)
            if(email=== data.email){
                toast({
                    title: data.message,
                    description: "Online Chat!!",
                    status: 'success',
                    duration: 2000,
                    isClosable: true,
                  })
            
                     setemail("");
                     onClose();
            }
            else{
                toast({
                    title: data.message,
                    description: "Online Chat!!",
                    status: 'warning',
                    duration: 2000,  
                    isClosable: true,
                  })

            
            }
      
    }
  return (
      <div>
    {children ? (<span onClick={onOpen}> {children}</span>) : (<IconButton d={{ase:"flex"}}
          icon={<ViewIcon />} onClick={onOpen}/>)}
          <Modal size="lg" onClose={onClose} isOpen={isOpen} isCentered>
   <ModalOverlay />
   <ModalContent h="410px">
     <ModalHeader fontSize="40px" fontFamily="Work sans" d="flex" justifyContent="center"
     >
       <h1>Forget User Password</h1>
     </ModalHeader>
     <ModalCloseButton />
     <ModalBody d="flex" flexDir="column" alignItems="center" justifyContent="space-between"
     >
                <FormControl>
            <FormLabel htmlFor='pass'>Enter Email</FormLabel>
            <Input id='text' name='email' value={email}   type='email' placeContent="Enter User Email" 
             required onChange={(e)=>{setemail(e.target.value)}} />
            <FormHelperText>Please Enter Valid User Email</FormHelperText>
            </FormControl>
            
            <Button onClick={SubmitHandle} colorScheme='blue' >Confirm</Button>
     </ModalBody>
     <ModalFooter>
       <Button onClick={onClose}>Close</Button>
     </ModalFooter>
   </ModalContent>
 </Modal>
</div>
  )
}

export default Forget