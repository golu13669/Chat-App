import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, useToast, VStack } from '@chakra-ui/react'
import React, { useState } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Forget from '../Forgetpass/Forget';


const Login = () => {

  const [email,setEmail]=useState("")
  const [password,setPassword]=useState("")
  const [show, setShow] = useState(false)
  const [loading,setLoading]=useState(false)

  const navigate=useNavigate()
  const toast=useToast();

  const handleClick = () => setShow(!show);

  const submitHanlder = async()=>{
    setLoading(true)
    if(!email|!password)
    {
        toast({
            title:"please fill all the field",
            status:"warning",
            duration:5000,
            isClosable:true,
            position:"bottom"
        })
        setLoading(false)
        return;
    }

    try{
        const config={
            headers:{
                "Content-type":"application/json"
            }
        }

        const {data}=await axios.post('/api/user/login',{email,password},config)
        // console.log(data)

        toast({
            title:"Login Successful",
            status:"success",
            duration:5000,
            isClosable:true,
            position:"bottom"
        });

        localStorage.setItem('userInfo',JSON.stringify(data))
        setLoading(false)

        navigate('/chats')
    }
    catch(error){
        toast({
            title:'Error Occured!',
            description:error.response.data.message,
            status:"warning",
            duration:5000,
            isClosable:true,
            position:"bottom"
        }); 

        setLoading(false)
    }

  }

  return (
    <VStack spacing='5px'>
      <FormControl id='email' isRequired>
            <FormLabel>Email</FormLabel>
            <Input 
                placeholder='Enter Your Email'
                value={email}
                onChange={(e)=>{setEmail(e.target.value)}}
            ></Input>
        </FormControl>
        <FormControl id='password' isRequired>
            <FormLabel>Password</FormLabel>
            <InputGroup>
            <Input
                type={show?'text':'password'}
                value={password}
                placeholder='Enter Password'
                onChange={(e)=>{setPassword(e.target.value)}}
            ></Input>
            
            <InputRightElement width="4.5rem">
            <Button h='1.75rem' size='xs' onClick={handleClick}>
                {show ? 'Hide' : 'Show'}
            </Button>
            </InputRightElement>

            </InputGroup>
        </FormControl>

        <Button
        colorScheme='green'
        width='100%'
        style={{marginTop:15}}
        isLoading={loading}
        onClick={submitHanlder}>
            Login
        </Button>
        <Forget>
      <Button
        variant="solid"
        colorScheme="red"
        width="100%"
      >
        Forgotten password?
      </Button>
      </Forget>
    </VStack>
  )
}

export default Login