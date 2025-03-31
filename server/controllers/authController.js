const User = require("../models/User")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const generateToken = (userId) => {
    return jwt.sign({id : userId}, process.env.JWT_SECRET,{expiresIn : "7d"})
}

///register a new user ; 
/// @route POST /api/auth/register
// @ public
const registerUser = async (req,res) => {
    try{
        const {name,email,password,adminInviteToken,profileImageUrl} = req.body

        //// checks if user already exist
        const userExists = User.findOne({ email })
        if(userExists) {
            return res.status(400).json({message : "User already exists"})
        }
        ///check and assign roles
        let role ="member"

        if(adminInviteToken && adminInviteToken == process.env.ADMIN_INVITE_TOKEN){
         role = "admin"
        }

        //hash password before creating user
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password,salt)

        /// Create new user
        const user = await User.create({
            name,
            email,
            password : hashedPassword,
            profileImageUrl,
            role
        })
        //return user with jwt
       res.status(201).json({
         _id : user._id,
         name : user.name,
         email : user.email,
         role : user.role,
         profileImageUrl : user.profileImageUrl,
         token : generateToken(user._id)
       })
        
    }catch(err){
        res.status(500).json({message : "Server error",error : err.message})
    }
}

///logs in a new user ; 
/// @route POST /api/auth/login
// @ public
const loginUser = async (req,res) => {
    try{
     const { } = req.body
    }catch(err){
        res.status(500).json({message : "Server error",error : err.message})
    }
}


///get user profile ; 
/// @route GET /api/auth/profile
// @ private ; require jwt
const getUserProfile = async (req,res) => {

    try{

    }catch(err){
        res.status(500).json({message : "Server error",error : err.message})
    }
}

///get user profile ; 
/// @route PUT /api/auth/profile
// @ private ; require jwt
const updateUserProfile = async (req,res) => {

    try{

    }catch(err){
        res.status(500).json({message : "Server error",error : err.message})
    }
}


module.exports  = { registerUser,loginUser,getUserProfile,updateUserProfile}

