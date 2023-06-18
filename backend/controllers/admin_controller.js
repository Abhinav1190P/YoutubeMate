const {User} = require('../models/User')
const {Channel} = require('../models/Channel')

exports.GetAllUsers = async (req,res,next) => {
    if(req.type === "admin"){
        try {
            const users = await User.find({isAdmin:{$ne:true}}).select('-password');
            return res.status(200).json({users:users})
        } catch (error) {
            return res.status(400).send({message:"Something went wrong"})
        }
    }
}


exports.GetUserAndChannels = async (req,res,next) => {

    const id = req.params.userid
    
    if(req.type === "admin"){
        try {
            const data = await User.findById(id)
            if(data){
                const channels = await Channel.find({userId:data._id})
                if(channels.length>0){
                    return res.status(200).send({user:data,channels:channels})
                }else{
                    return res.status(200).send({user:data}) 
                }
            }
            
            return res.status(200).send({message:"Hello"})
        } catch (error) {
            return res.status(200).send({message:"This is the message"})
        }
    }

}


exports.SetGlobalApiKey = async (req,res,next) => {
    const {key} = req.body
    try {
        const updateAdmin = await User.findByIdAndUpdate(req.user?.id,{$set:{global_key:key}})
        const updateResult = await User.updateMany({ isAdmin: false }, { $set: { global_key: key } });
        if(updateAdmin && updateResult){
            return res.status(200).send({message:"Update successful"})
        }
    } catch (error) {
        return res.status(200).send({message:error.message})
    }
}