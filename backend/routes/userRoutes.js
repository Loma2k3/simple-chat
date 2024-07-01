const express = require('express')
const {registerUser, authUser, allUsers} = require('../controller/userController')
const router = express.Router()
const { protect } = require('../middleware/authMiddleware')

router.route('/')
    .post(registerUser)
    .get(protect,allUsers)

router.route('/login')
    .post(authUser)

module.exports = router