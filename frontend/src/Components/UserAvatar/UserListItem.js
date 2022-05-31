import { Avatar, Box, Text } from '@chakra-ui/react'
import React from 'react'

const UserListItem = ({user,handleFunction}) => {
  return (
    <Box
        onClick={handleFunction}
        cursor='pointer'
        bg='#E8E8E8'
        _hover={{
            background:"#38B2ac",
            color:'white'
        }}
        w='100%'
        d='flex'
        alignContent='center'
        color='black'
        px={3}
        py={2}
        mb={2}
        borderRadius='lg'
    >
        <Avatar
            size='sm'
            mr={2}
            cursor='pointer'
            src={user.pic}
            alt={user.name}
        />
        <Box>
            <Text>{user.name}</Text>
            <Text fontSize='xs'>
                <b>Email : </b>
                {user.email}
            </Text>
        </Box>
    </Box>
  )
}

export default UserListItem