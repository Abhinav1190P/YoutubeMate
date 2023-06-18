const express = require('express')
const router = express.Router()
const {register,createChannel,protectedRoute,GetChannel,login,getUserInfoAndData,LatestProtectedRoute} = require('../controllers/user_controller')
const {protect} = require('../middleware/jwtVerify')
router.route("/register").post(register)

router.route('/login').post(login)

router.route("/create-channel").post(createChannel)

router.route("/protected-route").get(protect,LatestProtectedRoute)

router.route("/get-channels").get(GetChannel)

router.route("/get-user-info").get(getUserInfoAndData)

module.exports = router;