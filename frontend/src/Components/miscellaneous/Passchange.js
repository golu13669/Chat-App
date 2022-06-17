import React ,{useState} from 'react';
 import {useDisclosure} from  '@chakra-ui/hooks'
import { Button, FormControl, FormHelperText, FormLabel, IconButton, Input, InputRightElement, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter,
     ModalHeader, ModalOverlay} from '@chakra-ui/react';
import { ViewIcon } from '@chakra-ui/icons';
import  axios from 'axios';
import { useToast } from '@chakra-ui/react';
import {useNavigate} from "react-router-dom"
import { schema } from '../../Config/PasswordSchema';

const Passchange = ({children , user}) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [show, setShow] = useState(false)

    const [pass , setpass] =useState({password : "" , cpassword : ""})
    const navigate = useNavigate();
    const toast = useToast();
  
    const handlevalue=(e)=>{
       
        let value = e.target.value;
        let name =  e.target.name;
        setpass({...pass,[name] :value});
    }

    const handleClick = () => setShow(!show)
    
    const passHandle= async()=>{ 
        const { password , cpassword} =pass;
        if(!password || !cpassword){
            toast({
                title: "Enter NEW PASSWORD",
                description: "fill all details",
                status: 'warning',
                duration: 2000,
                isClosable: true,
              })
              return
        }
        else if(password === cpassword){
          if(schema.validate(password)===false)
          {
              const mesg = schema.validate(password, { details: true })
              toast({
                  title:mesg[0].message,
                  status:"warning",
                  duration:5000,
                  isClosable:true,
                  position:"bottom"
              })
              return;
          }

          try {
            console.log(user.token);
            const config = {
                headers:{
                  "Content-type" : "application/json",
                  "Authorization" : `Bearer ${user.token}`,
                }
              }

            const {data} = await axios.put('/api/user/changepass' , {password , cpassword} , config)
                console.log("data", data);
               
                toast({
                  title: data.message,
                  description: "..",
                  status: 'success',
                  duration: 2000,
                  isClosable: true,
                })
              setpass({password : "" , cpassword : ""})
              localStorage.removeItem("userInfo");

                navigate('/')
        } catch (error) {
            throw new Error("invalid pass change");
        }
        }
        else {
        toast({
          title: "Please Enter Same Password",
          description: "..",
          status: 'warning',
          duration: 2000,
          isClosable: true,
        })
        return 
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
       <h1>Set New Password</h1>
     </ModalHeader>
     <ModalCloseButton />
     <ModalBody d="flex" flexDir="column" alignItems="center" justifyContent="space-between"
     >
                <FormControl>
            <FormLabel htmlFor='pass'>New Password</FormLabel>
              <Input id='text' name='password' type={show?'text':'password'} value={pass.password} onChange={handlevalue} />
              <FormHelperText>We'll never share your password.</FormHelperText>
              <InputRightElement width="4.5rem">
                <Button h='1.75rem' size='xs' onClick={handleClick}>
                {show? 'Hide' : 'Show'}
                </Button>
              </InputRightElement>
            </FormControl>
            <FormControl>
            <FormLabel htmlFor='pass'>Re-Password</FormLabel>
            <Input id='text' name='cpassword'  value={pass.cpassword}   onChange={handlevalue} type='password' />
            </FormControl>
            <Button colorScheme='blue' onClick={passHandle}>Confirm</Button>
     </ModalBody>
     <ModalFooter>
       <Button onClick={onClose}>Close</Button>
     </ModalFooter>
   </ModalContent>
 </Modal>
</div>
)
  
}

export default Passchange;