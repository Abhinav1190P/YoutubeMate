import pc from '@prisma/client'
import { PubSub } from 'graphql-subscriptions'
import axios from 'axios'
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer'
const pubsub = new PubSub()
const prisma = new pc.PrismaClient()


const resolvers = {
  Query: {
    helloWorld: async (_, { args }) => {
      return "Hello"
    },
    checkVerifiedUser: async (_, {args}, context) => {
      
      return "HEy"
    }
  },
  Mutation: {
    userSignUp: async (_, { signUpGoogleData }) => {
      const { password,channel_id } = signUpGoogleData

      try {
        const data = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: {
            "Authorization": `Bearer ${signUpGoogleData.googleAccessToken}`
          }
        });

        const firstName = data.data.given_name;
        const email = data.data.email;
        const profile_photo = data.data.picture;

        const userFound = await prisma.user.findFirst({ where: { email: email } });

        if (!userFound) {

          const hashedPassword = await bcryptjs.hash(password, 12)


          const emailToken = jwt.sign({
            username: firstName
          }, "abhinav", { expiresIn: "15min" })

          const currentTime = new Date();
          const expirationTime = new Date(currentTime.getTime() + 15 * 60 * 1000); 
          const finalExpirationTime =  expirationTime.toISOString(); 
          let Token = ''

          await prisma.user.create({
            data: {
              email: email,
              profile_photo: profile_photo,
              username: firstName,
              password: hashedPassword,
              emailVerificationToken: emailToken,
              emailVerificationTokenExpiry: finalExpirationTime,
              channel_id: channel_id
            }
          }).then(async (data) => {
            const token = jwt.sign({
              email: data.email,
              id: data._id
            }, "abhinav", { expiresIn: "1h" })

            Token = token

            let testAccount = await nodemailer.createTestAccount();

            let transporter = nodemailer.createTransport({
              host: "smtp.ethereal.email",
              port: 587,
              secure: false,
              auth: {
                user: 'emilia.funk94@ethereal.email',
                pass: 'NeVsZKaHuMB56sWnWg'
              },
            });

            let info = await transporter.sendMail({
              from: '"YoutubeMate 👻" <abhinav@gmail.com>', 
              to: "pandeysandeep1190@gmail.com", 
              subject: "Hello ✔", 
              text: "Hello world?", 
              html: `<b>Hello! Verify email address by clicking on this <a href=http://localhost:5000/graphql/verify-email?token=${data.emailVerificationToken}>link</a></b>`, 
            });
            
          })

          return { success: true, message: Token };
        } else {
          return { success: false, message: "User already exists" };
        }
      } catch (error) {

        console.error(error);
        throw new Error("An error occurred while signing up the user.");
      }
    }

    ,
    userSignIn: async (_, { signInGoogleData }) => {

      try {
        const data = await new Promise((resolve, reject) => {
          axios
            .get("https://www.googleapis.com/oauth2/v3/userinfo", {
              headers: {
                "Authorization": `Bearer ${signInGoogleData.googleAccessToken}`
              }
            })
            .then(response => {
              const firstName = response.data.given_name;
              const email = response.data.email;
              const profile_photo = response.data.picture;
              resolve({ firstName, email, profile_photo });
            })
            .catch(error => {
              reject(error);
            });
        });

        const { firstName, email } = data;

        return { user_token: firstName };
      } catch (error) {
        console.log(error);
      }
    },
    createChannel: async (_, { ChannelData }, context) => {
      const { user_id, channelId, video_id, snippet, thumbnails, statistics, videos } = ChannelData;
      try {
        const userExists = await prisma.user.findUnique({ where: { id: context.user.id } });
        if(userExists){
          const channels = await prisma.channel.findMany({
            where: {
              userId: context.user.id
            }
          });
          
          
          if(channels?.length == 0){
            try {
              await prisma.channel.create({
                data:{
                  channelId,
                  snippet:{create: snippet},
                  thumbnails: {create: thumbnails},
                  statistics: {create: statistics},
                  videos: {create:videos}
                }
              })
              return {success:true,message:'created'}
            } catch (error) {
              console.log(error)
              return {success:false,message:error}
            }
          }
        }
        return { success: true, message: 'finding' };
      } catch (error) {
        // Handle the error
        console.log(error);
        return { success: false, message: error };
      }
    } 

  }

}
export default resolvers