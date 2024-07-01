import {
     VStack, Input, InputGroup,
    InputRightElement, Button
} from '@chakra-ui/react'
import {
  FormControl,
  FormLabel
} from '@chakra-ui/react'
import { useToast } from '@chakra-ui/react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


const Login = () => {
    const [show, setShow] = useState(false)
    const handleClick = () => setShow(!show)
    const [loading, setLoading] = useState(false)
    
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    const toast = useToast()
    const navigate = useNavigate();

    const submitHandler = async () => {
        setLoading(true)
        if (!email || !password) {
             toast({
                title: 'please Fill all the feilds',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: "bottom"
             })
            setLoading(false)
            return
        }

        try {
            const config = {
                header: {
                    "Content-type": "application/json"
                }
            }

            const { data } = await axios.post("/api/user/login",
                { email, password},
                config
            )

            toast({
                title: 'registration successful',
                status: 'success',
                duration: 5000,
                isClosable: true,
                position: "bottom"
             })
            
            localStorage.setItem('userInfo', JSON.stringify(data))
            setLoading(false)
            navigate('/chat');
        } catch (error) {
            toast({
                title: 'Error Occured!',
                description:error.response.data.message,
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: "bottom"
            })
            setLoading(false)
        }
    }

    return (<VStack spacing='5px'>
        <FormControl id="email" isRequired marginTop="15px">
            <FormLabel fontWeight="semibold" fontSize="20px">Email</FormLabel>
            <Input placeholder='Enter your Email'
                onChange={(e) => setEmail(e.target.value)}
                value={email}
            fontWeight="semibold" fontSize="20px" paddingY="20px"></Input>
        </FormControl>

        <FormControl id="password" isRequired marginTop="15px">
            <FormLabel fontWeight="semibold" fontSize="20px" >Password</FormLabel>
            <InputGroup>
                <Input
                    type={show ? 'text' : 'password'}
                    placeholder='Enter password'
                    fontWeight="semibold" fontSize="20px" paddingY="20px"
                    value={password}
                    onChange={e=> setPassword(e.target.value)}
                ></Input>

                <InputRightElement width='4.5rem'>
                    <Button h='1.75rem' size='sm' fontSize="15px" onClick={handleClick}>
                    {show ? 'Hide' : 'Show'}
                    </Button>
                </InputRightElement>
            </InputGroup>
         </FormControl>

        <Button colorScheme='blue' fontSize="20px"
            width="100%" height="3em" marginTop="15px"
            isLoading={loading} onClick={submitHandler}>Login</Button>
    </VStack>)
}

export default Login