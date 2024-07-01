const express = require("express")
const {chats} = require("./data/data")
const dotenv = require('dotenv')
const cors = require('cors')
const connectDB= require("./config/db")
const userRoutes = require("./routes/userRoutes")
const {notFound, errorHandler} = require("./middleware/errorMiddleware")
const chatRoutes = require("./routes/chatRoutes")
const messageRoutes= require("./routes/messageRoutes")
const path = require('path');

dotenv.config()
connectDB()

const app = express()

app.use(cors({
    // Allow only requests from this domain
    origin: '*',
}))

app.use(express.json())

app.use(express.static("../frontend/build"))
// app.get('/api/chat', (req, res) => {
//     res.send(chats)
// })

app.get('/api/chat/:id', (req, res) => {
    const singleChat = chats.find(c => c._id === req.params.id)
    res.send(singleChat)
})

app.use('/api/user', userRoutes)
app.use('/api/chat', chatRoutes)
app.use('/api/message', messageRoutes)

// app.use(notFound)
// app.use(errorHandler)

app.use(express.static(path.join(__dirname, '../frontend/build')));

app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname,"../frontend","build","index.html"));
});

const port = process.env.PORT 

app.listen(port, console.log("server created"))
