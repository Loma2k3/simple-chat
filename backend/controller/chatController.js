const asyncHandler = require("express-async-handler");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");


const accessChat = asyncHandler(async (request, response) => {
    const { userId } = request.body
    
    if (!userId) {
        console.log("UserId param not sent with request")
        return response.sendStatus(400)
    }

    var isChat = await Chat.find({
        isGroupChat: false,
        $and: [
            { users: { $elemMatch: { $eq: request.user._id } } },
            { users: { $elemMatch: { $eq: userId } } }
        ]
    }).populate("users", "-password")
        .populate("latestMessage")
    
    isChat = await User.populate(isChat, {
        path: "latestMesage.sender",
        select: "name pic email",
    })

    if (isChat.length > 0) {
        response.send(isChat[0])
    } else {
        var chatData = {
            chatName: "sender",
            isGroupChat: false,
            users: [request.user._id, userId]
        }

        try {
            const createdChat = await Chat.create(chatData)

            const FullChat = await Chat.findOne({ _id: createdChat._id })
                .populate("users", "-password")
            
            response.status(200).send(FullChat)
        } catch (error) {
            response.status(400)
            throw new Error(error.message)
        }
    }
})

const fetchChats = asyncHandler(async (request, response) => {
    try {
        Chat.find({
            users:{$elemMatch:{$eq:request.user._id}}
        }).populate("users", "-password")
            .populate("groupAdmin", "-password")
            .populate("latestMessage")
            .sort({ updateAt: -1 })
            .then(async (result) => {
                result = await User.populate(result, {
                    path: "latestMessage.sender",
                    select: "name pic email"
                })

                response.status(200).send(result)
        })
    } catch (error) {
        response.status(400)
        throw new Error(error.message)
    }
})

const createGroupChat = asyncHandler(async (request, response) => {
    if (!request.body.users || !request.body.name) {
        return response.status(400).send({message: "please Fill all the feilds"})
    }

    var users = JSON.parse(request.body.users)

    if (users.length < 2) {
        return response
            .status(400)
            .send("More than 2 users are required to form a group chat")
    }

    users.push(request.user)

    try {
        const groupChat = await Chat.create({
            chatName: request.body.name,
            users: users,
            isGroupChat: true,
            groupAdmin: request.user
        })

        const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
            .populate("users", "-password")
            .populate("groupAdmin", "-password")
        
        response.status(200).json(fullGroupChat)
    } catch (error) {
        response.status(400)
        throw new Error(error.message)
    }
})

const renameGroup = asyncHandler(async (request, response) => {
    const { chatId, chatName } = request.body
    
    const updatedChat = await Chat.findByIdAndUpdate(
        chatId,
        {
            chatName
        },
        {
            new:true
        }
    )
        .populate("users", "-password")
        .populate("groupAdmin", "-password")
    
    if (updatedChat) {
        response.json(updatedChat)
    } else {
        response.status(400)
        throw new Error("Chat Not Found")
    }
})

const addToGroup = asyncHandler(async (request, response) => {
    const { chatId, userId } = request.body
    
    const added = await Chat.findByIdAndUpdate(
        chatId,
        {
            $push: {users: userId}
        },
        { new: true }
    )
        .populate("users", "-password")
        .populate("groupAdmin", "-password")
    
    if (added) {
        response.json(added)
    } else {
        response.status(404)
        throw new Error("Chat not found")
    }

})

const removeFromGroup = asyncHandler(async (request, response) => {
    const { chatId, userId } = request.body
    
    const remove =await Chat.findByIdAndUpdate(
        chatId,
        {
            $pull:{users: userId}
        },
        {new:true}
    )
        .populate("users", "-password")
        .populate("groupAdmin", "-password")
    
    if (remove) {
        console.log(remove)

        response.json(remove)
    } else {
        response.status(404)
        throw new Error("Chat not found")
    }

})

module.exports = {
    accessChat,
    fetchChats,
    createGroupChat,
    renameGroup,
    addToGroup,
    removeFromGroup
}