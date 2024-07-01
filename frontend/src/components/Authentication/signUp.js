import {
     VStack, Input, InputGroup,
    InputRightElement, Button
} from '@chakra-ui/react'
import {
  FormControl,
  FormLabel
} from '@chakra-ui/react'
import { useToast } from '@chakra-ui/react'
import axios from "axios"
import { useState } from 'react'
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
    const [show, setShow] = useState(false)
    const [loading, setLoading] = useState(false)
    const handleClick = () => setShow(!show)
    const toast = useToast()
    const navigate = useNavigate()

    const postDetails = (pics) => {
        setLoading(true)
        if (pics === undefined) {
            toast({
                title: 'Please select an Image',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: "bottom"
            })
            return
        }

        if (pics.type === "image/jpeg" || pics.type === "image/png") {
            const data = new FormData()
            data.append("file", pics)
            data.append("upload_preset", "chat-app")
            data.append("cloud_name", "dlavkvoj3")
            fetch("https://api.cloudinary.com/v1_1/dlavkvoj3/image/upload", {
                method: 'post',
                body: data
            })
                .then(res => res.json())
                .then(data => {
                    console.log(data)
                    setPic(data.url.toString())
                    setLoading(false)

                    toast({
                        title: 'upload success',
                        status: 'success',
                        duration: 5000,
                        isClosable: true,
                        position: "bottom"
                    })
                })
                .catch(err => {
                    console.log(err)
                    setLoading(false)
                }) 
            
        } else {
             toast({
                title: 'This is not an image',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: "bottom"
            })
        }
    }

    const [name,setName]= useState()
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    const [pic,setPic]= useState()

    const submitHandler = async () => {
        setLoading(true);
        if (!name || !email || !password) {
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

            const { data } = await axios.post("/api/user",
                { name, email, password, pic },
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
            navigate('/')
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
        <FormControl id="first-name" isRequired marginTop="15px">
            <FormLabel fontWeight="semibold" fontSize="20px">Name</FormLabel>
            <Input placeholder='Enter your Name'
                onChange={(e) => setName(e.target.value)}
            fontWeight="semibold" fontSize="20px" paddingY="20px"></Input>
        </FormControl>

        <FormControl id="email" isRequired marginTop="15px">
            <FormLabel fontWeight="semibold" fontSize="20px">Email</FormLabel>
            <Input placeholder='Enter your Email'
                onChange={(e) => setEmail(e.target.value)}
            fontWeight="semibold" fontSize="20px" paddingY="20px"></Input>
        </FormControl>

        <FormControl id="password" isRequired marginTop="15px">
            <FormLabel fontWeight="semibold" fontSize="20px" >Password</FormLabel>
            <InputGroup>
                <Input
                    type={show ? 'text' : 'password'}
                    placeholder='Enter password'
                    fontWeight="semibold" fontSize="20px" paddingY="20px"
                    onChange={e=> setPassword(e.target.value)}
                ></Input>

                <InputRightElement width='4.5rem'>
                    <Button h='1.75rem' size='sm' fontSize="15px" onClick={handleClick}>
                    {show ? 'Hide' : 'Show'}
                    </Button>
                </InputRightElement>
            </InputGroup>
         </FormControl>
        
        <FormControl id="pic" marginTop="15px">
            <FormLabel fontWeight="semibold" fontSize="20px">Upload your picture</FormLabel>
            <Input
                type='file'
                p={1.5}
                accept='image/*'
                onChange={e => postDetails(e.target.files[0])}
            ></Input>
        </FormControl>

        <Button colorScheme='blue' fontSize="20px"
            width="100%" height="3em" marginTop="15px"
            onClick={submitHandler} isLoading={loading}>Sign Up</Button>
    </VStack>)
}

export default SignUp