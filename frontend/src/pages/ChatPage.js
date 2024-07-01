import ChatBox from "../components/chatBox"
import SideDrawer from "../components/miscellaneous/sideDrawer"
import MyChats from "../components/myChats"
import ChatProvider from "../context/ChatProvider"
const ChatPage = () => {

    return (
        <ChatProvider>
             <div className="h-screen flex flex-col">
                <SideDrawer></SideDrawer>
                <div className="flex basis-full">
                    <div className="basis-[30%]">
                        <MyChats></MyChats>
                    </div>
                    <div className="basis-[70%]">
                        <ChatBox></ChatBox>
                    </div>
                </div>
            </div>
        </ChatProvider>
    )
}

export default ChatPage