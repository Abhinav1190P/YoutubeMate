
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const nodemailer = require('nodemailer');
const {User} = require('../models/User')
const {Channel} = require('../models/Channel')
const {verifyToken} = require('../middleware/index')


exports.register = async (req,res,next) => {
    const { password, profile_photo, firstName, email, gender, location, phone } = req.body;

    try {
      
  
      const userFound = await User.findOne({ email });
  
      if (!userFound) {
        const hashedPassword = await bcrypt.hash(password, 12);
  
        const emailToken = jwt.sign({ username: firstName }, 'abhinav', { expiresIn: '15min' });
        const currentTime = new Date();
        const expirationTime = new Date(currentTime.getTime() + 15 * 60 * 1000);
        const finalExpirationTime = expirationTime.toISOString();
        let Token = '';
  
        const newUser = new User({
          email,
          profile_photo,
          username: firstName,
          password: hashedPassword,
          gender:gender,
          location:location,
          phone:phone,
          emailVerificationToken: emailToken,
          emailVerificationTokenExpiry: finalExpirationTime
        });
  
        const savedUser = await newUser.save();
  
        const token = jwt.sign({ email: savedUser.email, id: savedUser._id }, 'abhinav', { expiresIn: '1h' });
        Token = token;
  
        let testAccount = await nodemailer.createTestAccount();
  
        let transporter = nodemailer.createTransport({
          service:'gmail',
          auth:{
            user:'pandeysandeep1190@gmail.com',
            pass:'zpzqdreaqzorwdfe'
          }
        });
  
        let info = await transporter.sendMail({
          from: '"YoutubeMate 👻" <abhinav@gmail.com>',
          to: 'pandeysandeep1190@gmail.com',
          subject: 'Hello ✔',
          text: 'Hello world?',
          html: `<b>Hello! Verify email address by clicking on this <a href=http://localhost:3001/api/verify/verify-email?token=${token}>link</a></b>`,
        });
        
        transporter.sendMail(info,function(error,data){
          if(error){
            console.log(error)
          }
          else{
            console.log("Email sent: " + info.response)
          }
        })
        return res.status(200).send({ success: true, message: 'User registered' });
      } else {
        return { success: false, message: 'User already exists' };
      }
    } catch (error) {
      console.error(error);
      throw new Error('An error occurred while signing up the user.');
    }
}

exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  try {

    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    const token = jwt.sign({ userId: user._id }, 'abhinav', { expiresIn: '1h' });


    res.json({ token });

  } catch (error) {
    
    next(error);
  }
};



exports.protectedRoute = async (req,res,next) => {
  try {
    const authHeader = req.headers.authorization || "";
    if (authHeader) {
      token = authHeader.split(" ")[1];
      
      const payload = await verifyToken(token);

      isAuthenticated = payload ? true : false;
      await axios.get(`https://${process.env.AUTH0_DOMAIN}/userinfo`,{headers:{
        "Authorization":`${authHeader}`
      }}).then(async (data)=>{
        if(data){

          const UserExistsAndIsAdmin = await User.find({email:data?.data?.email})
          console.log(UserExistsAndIsAdmin)
          if(UserExistsAndIsAdmin[0].isAdmin){
            res.status(200).send({user:UserExistsAndIsAdmin[0]})
          }else{
            res.status(403).send({success:false,messsage:"UnAuthorized"})
          }
        }
      })
      

    }
  } catch (error) {
    console.log("error: ", error);
  }
} 

exports.getUserInfoAndData = async (req,res,next) => {
  const authHeader = req.headers.authorization || "";
    if (authHeader) {
      token = authHeader.split(" ")[1];
      
      const payload = await verifyToken(token);

      isAuthenticated = payload ? true : false;
      await axios.get(`https://${process.env.AUTH0_DOMAIN}/userinfo`,{headers:{
        "Authorization":`${authHeader}`
      }}).then(async (data)=>{
        if(data){

          const UserExists = await User.find({email:data?.data?.email})
       
          if(UserExists){
            const UserHasChannels = await Channel.find({userId:UserExists[0]._id})
            if(UserHasChannels.length > 0){
              return res.status(200).send({user:UserExists,channels:UserHasChannels})
            }
            else{
              return res.status(200).send({user:UserExists})
            }
          }

        }
      })
      

    }
}

exports.createChannel = async (req,res,next) => {
  const { user_id, channelId, video_id, snippet, thumbnails, statistics, videos } = req.body.ChannelData;

  try {
    const userExists = await User.findById(user_id);
    if (userExists) {
      const channels = await Channel.find({ userId: user_id });
      
      if (channels.length === 0) {
        
          const newChannel = await new Channel({
            userId:user_id,
            channelId,
            snippet,
            thumbnails,
            statistics,
            videos
          });
          const savedChannel = await newChannel.save();
          console.log(savedChannel,'HET')
          return { success: true, message: 'created' };
        
      }
    }

    return { success: true, message: 'finding' };
  } catch (error) {
    console.log(error)
    return { success: false, message: error };
  }
};

exports.LatestProtectedRoute = (req,res,next) => {
  if(req.user !== "none" && req.type === "admin"){
    return res.status(200).send({user:req.user})
  }
  else{
    return res.status(403).send({message:"You are not authorized"})
  }

}

exports.GetChannel = async (req,res,next) => {

  try {
    const channels = await Channel.findById('648acf910ef6278e670b318a')
    
    return res.status(200).send({success:true,data:channels})
  } catch (error) {
      return error
  }
}