import React, { useState } from "react"
import { Button, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerFooter, DrawerHeader, DrawerOverlay, Input, Spinner, Tooltip, useDisclosure } from '@chakra-ui/react'
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuItemOption,
  MenuGroup,
  MenuOptionGroup,
  MenuDivider,
} from '@chakra-ui/react'
import { Avatar, AvatarBadge, AvatarGroup } from '@chakra-ui/react'
import { ChatState } from "../../context/ChatProvider"
import ProfileModal from "./profileModal"
import { useNavigate } from "react-router-dom"
import { useToast } from '@chakra-ui/react'
import axios from "axios"
import ChatLoading from "../chatLoading"
import UserListItem from "../UserAvatar/userListItem"

const SideDrawer = () => {
    const [search, setSearch] = useState("")
    const [searchResult, setSearchResult] = useState([])
    const [loading, setLoading] = useState(false)
    const [loadingChat, setLoadingChat] = useState()
    const {user, setChats} = ChatState()
    const navigate = useNavigate()

    //drawer
    const { isOpen, onOpen, onClose } = useDisclosure()
    const btnRef = React.useRef()

    const logoutHandler = () => {
        localStorage.removeItem("userInfo")
        navigate("/")
    }

    const toast = useToast()
    const handleSearch = async () => {
        if (!search) {
             toast({
                title: 'plese enter something in search',
                status: 'warning',
                duration: 5000,
                 isClosable: true,
                position: "top-left"
            })
        }

        try {
            setLoading(true)

            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }
        
            const {data} = await axios.get(`/api/user?search=${search}`,config)
            
            setLoading(false)
            setSearchResult(data)
        } catch (error) {
            toast({
                title: 'Error Occured!',
                status: 'error',
                duration: 5000,
                 isClosable: true,
                position: "top-left"
            })
        }
    }

    const accessChat = async (userId) => {
        try {
            const config = {
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${user.token}`
                }
            }

            const {data} = await axios.post("/api/chat", {userId}, config)
            toast({
                title: 'Created chat success!',
                status: 'success',
                duration: 5000,
                 isClosable: true,
                position: "top-left"
            })

            setChats(data)

        } catch (error) {
            toast({
                title: 'Error Occured!',
                status: 'error',
                duration: 5000,
                 isClosable: true,
                position: "top-left"
            })
        }
    }

    return (
        <div class="text-black bg-3AA6B9 flex justify-between items-center p-4">
            <Tooltip label="Search Users to chat"
                hasArrow placement="bottom-end"
            >
                <Button variant="ghost" ref={btnRef} onClick={onOpen}>
                    <i class="fa-solid fa-magnifying-glass"></i>
                    <p class="ml-4">Search User</p>
                </Button>
            </Tooltip>

            <h1 class="text-[30px] font-bold">BACH'S MESSAGES</h1>

            <Menu>
                <MenuButton height="50px" as={Button} rightIcon={<i class="fa-solid fa-chevron-down"></i>}>
                    <Avatar name={user.name}
                        cursor="pointer"
                        src={user.pic} />
                </MenuButton>
                <MenuList>
                    <ProfileModal user={user}>
                        My Profile
                    </ProfileModal>
                    <MenuDivider></MenuDivider>
                    <MenuItem onClick={logoutHandler}>Logout</MenuItem>
                </MenuList>
            </Menu>
            
            <Drawer
                isOpen={isOpen}
                placement='left'
                onClose={onClose}
                finalFocusRef={btnRef}
            >
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerCloseButton color="black"/>
                    <DrawerHeader textColor="black">Search Users</DrawerHeader>

                    <DrawerBody display="flex" flexDirection="column">
                        <div class="flex ">
                            <Input placeholder="search by name or email"
                            pr="2px"
                            color="black"
                            value={search}
                            onChange={e=> setSearch(e.target.value)}
                            ></Input>
                            <Button colorScheme='blue' ml="5px" onClick={handleSearch}>search</Button>
                        </div>
                        {loading ? (
                            <ChatLoading/>
                        ) : (
                            searchResult?.map(user => (
                                <UserListItem
                                    key={user._id}
                                    user={user}
                                    handleFunction={()=>accessChat(user._id)}
                                ></UserListItem>    
                            ))
                        )}
                        {loadingChat && <Spinner color="#3AA6B9"/>}
                    </DrawerBody>
                </DrawerContent>
            </Drawer>

        </div>
    )
}

export default SideDrawer