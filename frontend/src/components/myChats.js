import { useEffect, useState } from "react"
import { ChatState } from "../context/ChatProvider"
import axios from "axios"
import { useToast } from "@chakra-ui/react"

const MyChats = () => {
    const user = JSON.parse(localStorage.getItem('userInfo')) 
    const {chats, selectedChat, setSelectedChat} = ChatState()
    const [myChat,setMyChat] = useState([])
    const toast = useToast()
    const fetchChat=async() => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            };

            const { data } = await axios.get("/api/chat", config);

            setMyChat(data)

        } catch (error) {
            //setMyChat({})
            toast({
                title: 'error fetch chats!',
                status: 'error',
                duration: 5000,
                 isClosable: true,
                position: "top-left"
            })
        }
    }

    useEffect(() => {
        fetchChat()
    },[chats])

    return (
        <div className="bg-[#FFD0D0] text-black h-full p-[2rem]">
            <div>
                <h1 className="text-[30px] font-semibold">My Chats</h1>
            </div>
            <div class="flex flex-col-reverse">
                {myChat?.map((chat, index) => {
                    const chatUser = chat.users.find(use => use.email !== user.email);
                return selectedChat !== chat._id ? (
                    <div 
                        key={index} // Add a unique key
                        className="bg-[#FF9EAA] p-[1rem] rounded-lg mt-3 hover:brightness-110"
                        onClick={() => setSelectedChat(chat._id)} // Use an anonymous function
                    >
                        <span>{chatUser.name}</span>
                    </div>
                ) : (
                    <div 
                        key={index} // Add a unique key
                        className="bg-[#3AA6B9] p-[1rem] rounded-lg mt-3" 
                        onClick={() => setSelectedChat(chat._id)} // Use an anonymous function
                    >
                        <span>{chatUser.name}</span>
                    </div>
                ); // Use null for no rendering
            })}
            </div>
            
        </div>
    )
}

export default MyChats