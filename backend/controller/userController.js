const asyncHandler = require("express-async-handler")
const User = require("../models/userModel")
const generateToken = require('../config/generateToken')


const registerUser = asyncHandler(async (request, response) => {
    const { name, email, password, pic } = request.body
    
    if (!name || !email || !password) {
        response.status(400)
        throw new Error("please enter all the field")
    }

    const userExists = await User.findOne({ email })
    
    if (userExists) {
        response.status(400)
        throw new Error("User already exists")
    }

    const user = await User.create({
        name,
        email,
        password,
        pic
    })

    if (user) {
        response.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            pic: user.pic,
            token: generateToken(user._id)
        })
    } else {
        response.status(400)
        throw new Error("Failed to create the user")
    }
})

const authUser = asyncHandler(async (request, response) => {
    const { email, password } = request.body
    
    const user = await User.findOne({ email })
    
    if (user && (await user.matchPassword(password))) {
        response.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            pic: user.pic,
            token: generateToken(user._id)
        })
    } else {
        res.status(401)
        throw new Error("Invalid Email or Password")
    }
})

// api/user?search=bach
const allUsers = asyncHandler(async (request, response) => {
    const keyword = request.query.search ? {
        $or: [
            { name: { $regex: request.query.search, $options: "i" } },
            { email: { $regex: request.query.search, $options: "i" } }
        ]
    }:{}
        
    const users = await User.find(keyword).find({_id:{$ne: request.user._id}})
    response.send(users)
})

module.exports = { registerUser, authUser , allUsers}