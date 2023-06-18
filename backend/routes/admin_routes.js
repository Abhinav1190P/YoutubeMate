const express = require('express')
const router = express.Router()
const {protect} = require('../middleware/jwtVerify')
const {GetAllUsers,GetUserAndChannels,SetGlobalApiKey} = require('../controllers/admin_controller')


router.route("/getallusers").get(protect,GetAllUsers)

router.route("/GetUserAndChannels/:userid").get(protect,GetUserAndChannels)

router.route("/SetGlobalApiKey").post(protect,SetGlobalApiKey)

module.exports = router;