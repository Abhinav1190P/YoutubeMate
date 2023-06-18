const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  isAdmin:{
    type: Boolean,
    default: false
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  gender:{
    type:String,
    required:true,
  },
  location:{
    type:String,
    required:true
  },
  global_key:{
    type:String
  },
  phone:{
    type:String,
    required:true
  },
  profile_photo: {
    type: String
  },
  password: {
    type: String,
    required: true
  },
  channel_id:{
    type:String,
    required:false,
  },
  emailVerificationToken: {
    type: String
  },
  emailVerificationTokenExpiry: {
    type: Date
  }
});

const User = mongoose.model('User', userSchema);

module.exports = {User};
