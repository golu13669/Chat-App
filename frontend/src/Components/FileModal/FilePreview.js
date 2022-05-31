import { CloseIcon } from '@chakra-ui/icons'
import { Box, IconButton,} from '@chakra-ui/react';
import React from 'react'

const FilePreview = ({submitImage,file,setFile}) => {
    
    return (
      <div className='filePreview'>
        <Box
            d='flex'
            flexDir={'column'}
            justifyContent='flex-end'
            p={3}
            mb={3}
            bg={'#99AAB5'}
            w='100%'
            h='auto'
            overflowY='hidden'
            borderRadius='lg'
        >
            <Box
                d='flex'
                flexDir={'column'}
                alignItems='center'
            >
                <img src={URL.createObjectURL(file)} alt = "attachment Selected" style={{height:"500px",width:"auto",objectFit:"contain",marginBottom:"5px"}}></img>
                    <Box
                        display={'flex'}
                        alignItems='center'
                    >
                        <IconButton
                            icon={<CloseIcon/>}
                            colorScheme='teal'
                            onClick={()=>{setFile('')}}
                            width='100px'
                            mr={5}
                        />

                        <IconButton
                            ml={5}
                            colorScheme='teal'
                            icon={<i className="fa fa-paper-plane" aria-hidden="true"></i>}
                            width='100px'
                            onClick={submitImage}
                        />
                    </Box>
            </Box>
        </Box>
      </div>
    )
}

export default FilePreview