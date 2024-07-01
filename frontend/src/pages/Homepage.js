import React from "react"
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import Login from '../components/Authentication/login'
import SignUp from '../components/Authentication/signUp'
import { useNavigate } from 'react-router-dom';
import {useEffect} from "react"

const Homepage = () => {

    const navigate = useNavigate()

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"))
        if (userInfo) {
            navigate('/chat')
        }
    },[])

    return (<div className="max-w-3xl mx-auto mt-[40px] text-black ">
        <div className="bg-slate-50 font-semibold
        text-[50px] text-center rounded-lg py-6">
            Message
        </div>
        <div className="mt-[15px] bg-slate-50 rounded-lg p-6">
            <Tabs variant='soft-rounded' colorScheme='green'>
                <TabList>
                    <Tab width='50%' fontSize='2xl' color='black'>Login</Tab>
                    <Tab width='50%' fontSize='2xl' color='black'>Sign Up</Tab>
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
        </div>
    </div>)
}

export default Homepage