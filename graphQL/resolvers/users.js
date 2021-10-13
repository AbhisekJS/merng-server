// Import Dependencies 
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UserInputError } = require('apollo-server-express');

const {
    validateRegisterInput,
    validateLoginInput
} = require('../../utils/validators');
const User = require('../../models/User')
const SECRET_KEY = process.env.SECRET_KEY;

function generateToken(user) {
    return jwt.sign(
      {
        id: user.id,
        email: user.email,
        username: user.username
      },
      SECRET_KEY,
      { expiresIn: '1h' }
    );
  }
  
module.exports={
    Mutation : {
        async register(
            _,
            {
                registerInput: {username,email,password,confirmPassword}
            }
        ){
            const {valid,errors} = validateRegisterInput(
                username,
                email,
                password,
                confirmPassword
            )
            if(!valid){
                throw new UserInputError('Errors',{errors})
            }
            // check for user if exist
            const user = await User.findOne({username})
            if(user){
                throw new UserInputError('User Already Exists',{
                    errors:{
                        username: 'This username is taken'
                    }
                })
            }
            password = await bcrypt.hash(password,12)

            const newUser = new User({
                email,
                username,
                password,
                createdAt: new Date().toISOString(),
            })

            const res = await newUser.save();

            const token = generateToken(res);

            return{
                ...res._doc,
                id: res._id,
                token
            }
        },

        // User Login/SignIN 
        async login(_,{username,password}){
            const {errors,valid}=validateLoginInput(username,password);

            if(!valid) {
                throw new UserInputError('User Not found',{errors})
            }

            const user = await User.findOne({username});

            if(!user){
                errors.general = 'User not Found'
                throw new UserInputError('User not found', { errors });
            }

            const match = await bcrypt.compare(password,user.password);

            if(!match){
                errors.general = 'Wrong credentials'
                throw new UserInputError('Wrong Credentials', {errors});
            }

            const token = generateToken(user);

            return{
                ...user._doc,
                id: user._id,
                token
            }
        }
    }
}