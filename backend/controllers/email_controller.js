const jwt = require('jsonwebtoken')
const { User } = require('../models/User')

exports.VerifyEmail = async (req,res,next) => {
    const token = req.query.token
    
    try {
        const decoded = await jwt.verify(token,'abhinav')
        if(decoded){
            const userExists = await User.find({email:decoded.email})
            if(userExists){
                const user = await User.findOneAndUpdate(
                    { emailVerificationToken: token },
                    { emailVerificationToken: 'none' },
                    { new: true }
                  );
                  return res.status(200).send("Email verified!")
            }
            else{
                return res.status(200).send("User does not exist!")
            }
        }
    } catch (error) {
        console.log("Hey")
    }
}
