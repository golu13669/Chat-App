import React from 'react';
import { Button } from "@chakra-ui/button";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { VStack } from "@chakra-ui/layout";
import { useState } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import {  useToast , Box} from '@chakra-ui/react';
import { schema } from '../../Config/PasswordSchema'; 
const Forgetpass = () => {
    const[password, setpassword] = useState('');
    const[confirmpassword, setconfirmpassword] = useState('');

    const [show ,setshow] = useState(false);
    const {id,token} = useParams();
    console.log("check params:" , id , token)
    const toast = useToast()
    const navigate = useNavigate();
   
    const handleClick=()=>{
        setshow(!show);
    }
    const submitHandler=async ()=>{
      console.log("kforun");
        console.log(password , confirmpassword)
        if(password && confirmpassword){
            if(password !== confirmpassword){
                toast({
                    title: "Both Password Not Match",
                    description: "fill all details",
                    status: 'warning',
                    duration: 4000,
                    isClosable: true,
                  })
                  return;
            }

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
                const  config = {
                    headers:{
                      "Content-type" : "application/json"
                    }
                  }
                const {data} = await axios.post(`${token}` , {password , confirmpassword} , config)
                console.log(data);
                toast({
                    title: "Reset sucessful",
                    description: "APPROVED" ,
                    status: 'success',
                    duration: 4000,
                    isClosable: true,
                  })
                //  console.log(login);
                navigate("/")
                // setpassword("")
               }
                catch(error){
                  toast({
                      title: error.message,
                      description:"fail",
                      status:"warning",
                      duration:2000,
                      isClosable:true,
                      position:"bottom"
                  }); 
          
                
              }
        }
        else{
            toast({
                title: "fill both input field",
                description: "fill all details",
                status: 'warning',
                duration: 4000,
                isClosable: true,
              })
              return;
        }
      
    
    }
  
  return (
    <Box w="100%" >
    <VStack spacing="10px"  mx="550px" mt="15%" >
      <FormControl id="password" w="100%" isRequired>
        <FormLabel>New Password</FormLabel>
        <Input
         name='password'
          type={show ? "text" : "password"}
         value={password}
          placeholder="Enter Your New password"
          onChange={(e)=>{setpassword(e.target.value);}}
        />
      </FormControl>
      <FormControl id="cpassword" isRequired>
        <FormLabel>Confrim Password</FormLabel>
        <InputGroup size="md">
          <Input
            name='confirmpassword'
            onChange={(e)=>{setconfirmpassword(e.target.value);}}
            type={show ? "text" : "password"}
            value={confirmpassword}
            placeholder="Enter Confirm Password"
          />
          <InputRightElement width="3.5rem">
            <Button h="1rem" w='1rem' size="sm" fontSize='0.7rem' onClick={handleClick}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <Button
        colorScheme="blue"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={submitHandler}
       
      >
        Confirm
      </Button>
   
    </VStack>
    </Box>
  );
}

export default Forgetpass;