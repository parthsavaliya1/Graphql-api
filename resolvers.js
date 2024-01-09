const {randomBytes} = require('crypto')
const userModel = require('./model/User')
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { JWT_SECRET } = require('./config');
const User =  mongoose.model('User')
const Quote = mongoose.model('Quotes')
const jwt = require('jsonwebtoken')

const resolvers = {
    Query: {
        users: async () => await User.find({}),
        user:async (_,{_id}) => await User.findOne({_id}),
        quotes:async() => await Quote.find({}).populate("by","_id firstName"),
        quoteByUser:async(_,{_id}) => await Quote.find({by:_id})
    },
    User:{
        quotes: async(users) => await Quote.find({by:users?._id})
    },
    Mutation:{
        signupUser:async (_,{userNew})=>{
           const isUserExist= await User.findOne({email:userNew?.email});
           if(isUserExist) {
            throw new Error('User already exist with same email!!')
           }
           console.log(userNew)
           const hashedPassword = await bcrypt.hash(userNew?.password,12);
          const newUser =  new User({
            ...userNew,
            password:hashedPassword
           })

           return await newUser.save()
        },
        signInUser:async (_,{userSignIn})=>{
            const user = await User.findOne({email:userSignIn.email});
            if(!user) {
                throw new Error(`User doesn't exist with email`);
            }

            const matchedPass = await bcrypt.compare(userSignIn.password, user.password);

            if(!matchedPass) {
                throw new Error('Email or Password is Invalide')
            }

            const token = jwt.sign({userId:user?._id},JWT_SECRET);

            return {token}
         },

         createQuote:async (_,{name},{userId})=> {
            if(!userId) {
                throw new Error('You must be login first');
            }
            const newQuote=  new Quote({
                name,
                by:userId
            })

            await newQuote.save()
            return "Quote saved successfully"
         }
    }


}

module.exports={resolvers}