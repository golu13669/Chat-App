import React, { useEffect } from 'react';
import {Box, Container, Tab, TabList, TabPanel, TabPanels, Tabs, Text} from '@chakra-ui/react';
import Login from '../Components/Authentication/Login';
import SignUp from '../Components/Authentication/SignUp';
import { useNavigate } from 'react-router-dom';

const Homepage = () => {

  const navigate=useNavigate();

    useEffect(()=>{
        const userInfo=JSON.parse(localStorage.getItem('userInfo'))

        if(userInfo){
            navigate('/chats')
        }
    },[navigate])

  return (
    <Container maxW='xl' centerContent>
      <Box 
      d='flex'
      justifyContent='center'
      p={3}
      background='white'
      w="100%"
      m="40px 0 50px 0" 
      borderRadius='lg'
      borderWidth="1px"
      >
        <Text fontSize='4xl' fontFamily="Work sans" color="black">
          CHAT - APP
        </Text>
      </Box>
      <Box background="white" w='100%' p={4} borderRadius='lg' borderWidth='1px'>
      <Tabs variant='soft-rounded' colorScheme='green'>
        <TabList mb='1em'>
          <Tab width='50%'>Login</Tab>
          <Tab width='50%'>Sign Up</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Login/>
          </TabPanel>
          <TabPanel>
            <SignUp/>
          </TabPanel>
        </TabPanels>
      </Tabs>
      </Box>
    </Container>
  )
}

export default Homepage