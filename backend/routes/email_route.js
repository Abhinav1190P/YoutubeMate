const express = require('express')
const router = express.Router()
const {VerifyEmail} = require('../controllers/email_controller')

router.route('/verify-email').get(VerifyEmail)
module.exports = router;