import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input,
  useToast,
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { ChatState } from '../context/ChatProvider'
import axios from 'axios'


const ChatBox = () => {
    const {selectedChat } = ChatState()
    const [chat, setChat] = useState("")
    const [chatSteam,setChatSteam] = useState([])
    const user = JSON.parse(localStorage.getItem("userInfo")) 
    const toast =useToast()


    const fetchChat = async () => {
        if (selectedChat === "") {
            return
        }

        console.log(selectedChat)

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }
            console.log(config)

            const {data} = await axios.get(`/api/message/${selectedChat}`,config)
            setChatSteam(data)
            console.log(data)
        } catch (error) {
            toast({
                title: 'error fetch chats!',
                status: 'error',
                duration: 5000,
                 isClosable: true,
                position: "bottom-center"
            })
        }
    }
    
    useEffect(() => {
        fetchChat()
    },[selectedChat])

    const sendMessage =async (event) => {
        if (event.key == "Enter") {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${user.token}`
                    }
                }

                const content = {
                    "content": `${chat}`,
                    "chatId":`${selectedChat}`
                }

                await axios.post("/api/message", content, config)
                    .then(response => {
                        setChat("")
                    })
                
            } catch (error) {
                toast({
                    title: 'send message error!',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                    position: "bottom-center"
                })
            }
        }
    }

    return (
        <div class="bg-[#F9F9E0] h-full flex flex-col justify-between text-black">
            <div class="basis-full flex flex-col-reverse px-6">
                <div class="flex flex-col text-[20px]">
                    {chatSteam?.map((steam,index) => {
                    return steam.sender._id ==user._id ?(
                        <p key={index} class="bg-[#FF9EAA] rounded-full p-2 mt-2 self-end max-w-[50%]">
                            {steam.content}
                        </p>
                    ) : (
                        <p key={index} class="bg-[#3AA6B9] rounded-full p-2 mt-2 self-start max-w-[50%]">
                            {steam.content}
                        </p>
                    )
                })}
                </div>    
            </div>
            
            <div class="p-3">
                <input type='text' placeholder='text'
                    class="w-full p-3 text-[20px]" onChange={e => setChat(e.target.value)}
                    onKeyDown={e=>sendMessage(e)} value={chat}
                ></input>
            </div>
        </div>
    )
}

export default ChatBox