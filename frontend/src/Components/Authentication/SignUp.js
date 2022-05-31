import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, useToast, VStack } from '@chakra-ui/react'
import React, { useState } from 'react'
import{useNavigate} from 'react-router-dom'
const axios=require('axios')

const SignUp = () => {

    const [name,setname]=useState()
    // const [lname,setLname]=useState('')
    const [email,setEmail]=useState()
    const [confirmPassword,setConfirmPassword]=useState()
    const [password,setPassword]=useState()
    const [pic,setPic]=useState()
    const [show, setShow] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const [loading,setLoading]=useState(false)

    const toast=useToast();
    const navigate=useNavigate()

    const handleClick = () => setShow(!show)
    const handleClickConfirm = () => setShowConfirm(!showConfirm)

    const postDetails=(pics)=>{
        setLoading(true)
        if(pics===undefined)
        {
            toast({
                title:"please select an image",
                status:"warning",
                duration:5000,
                isClosable:true,
                position:"bottom"
            })
            setLoading(false)
            return;
        }
        if(pics.type==='image/jpeg'||pics.type==='image/png')
        {
            const data=new FormData();
            data.append("file",pics)
            data.append("upload_preset","chat-app");
            data.append("cloud_name","dkij14ph5");

            fetch('https://api.cloudinary.com/v1_1/dkij14ph5/image/upload',{
                method:'post',
                body:data,
            })
            .then((res)=>res.json())
            .then((data)=>{
                // console.log(data)
                setPic(data.url.toString())
                setLoading(false)
            })
            .catch((err)=>{
                console.log(err)
                setLoading(false)
            })
        }
    }
    
    const submitHanlder=async()=>{
        setLoading(true)
        if(!name||!email|!password||!confirmPassword)
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

        if(password!==confirmPassword)
        {
            toast({
                title:"Password Do Not Match",
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

            const {data}=await axios.post('/api/user',{name,email,password,pic},config)
            console.log(data)

            toast({
                title:"Registration Successful",
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
                title:'Error Occured',
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
        <FormControl id='first-name' isRequired>
            <FormLabel>First name</FormLabel>
            <Input 
                placeholder='Enter Your Name'
                onChange={(e)=>{setname(e.target.value)}}
            ></Input>
        </FormControl>
        {/* <FormControl id='last-name'>
            <FormLabel>Last name</FormLabel>
            <Input 
                placeholder='Enter Your Last Name'
                onChange={(e)=>{setLname(e.target.value)}}
            ></Input>
        </FormControl> */}
        <FormControl id='email' isRequired>
            <FormLabel>Email</FormLabel>
            <Input 
                placeholder='Enter Your Email'
                onChange={(e)=>{setEmail(e.target.value)}}
            ></Input>
        </FormControl>
        <FormControl id='password' isRequired>
            <FormLabel>Password</FormLabel>
            <InputGroup>
            <Input 
                type={show?'text':'password'}
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
        <FormControl id='confirm-password' isRequired>
            <FormLabel>Confirm Password</FormLabel>
            <InputGroup>
            <Input 
                type={showConfirm?'text':'password'}
                placeholder='Enter Password'
                onChange={(e)=>{setConfirmPassword(e.target.value)}}
            ></Input>

            <InputRightElement width="4.5rem">
            <Button h='1.75rem' size='xs' onClick={handleClickConfirm}>
                {showConfirm ? 'Hide' : 'Show'}
            </Button>
            </InputRightElement>
            </InputGroup>
        </FormControl>
        <FormControl id='pic'>
            <FormLabel>Upload Your Picture</FormLabel>
            <Input 
                type='file'
                p={1.5}
                accept='image/*'
                onChange={(e)=>{postDetails(e.target.files[0])}}
            ></Input>
        </FormControl>

        <Button
        colorScheme='green'
        width='100%'
        style={{marginTop:15}}
        isLoading={loading }
        onClick={submitHanlder}>
            Sign Up
        </Button>
    </VStack>
  )
}

export default SignUp