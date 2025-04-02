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
        const userExists = await User.findOne({ email })
        
        if(userExists) {
            return res.status(400).json({message : "user already exist"})
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
     const {email,password } = req.body
     if (!email || !password) return res.status(400).json({message : "invalid email or password"})
        const foundUser = await User.findOne({ email})
    // check if user's data exists
    if (!foundUser) return res.status(400).json({message : "user not found,proceed create account"})
    // is password matched
     const matchedPwd = await bcrypt.compare(password,foundUser.password)
     if(!matchedPwd) return res.status(400).json({message : "incorrect password"})
    //  return user's data with jwt token
    res.status(200).json({
        _id : foundUser._id,
        name : foundUser.name,
        email : foundUser.email,
        role : foundUser.role,
        profileImageUrl : foundUser.profileImageUrl,
        token : generateToken(foundUser._id)
      })
     
    }catch(err){
        res.status(500).json({message : "Server error",error : err.message})
    }
}


///get user profile ; 
/// @route GET /api/auth/profile
// @ private ; require jwt
const getUserProfile = async (req,res) => {
//    const {user} = req.body
 
    try{
        const userData = await User.findById(req.user.id).select("-password");
        if (!userData) {
         return res.status(404).json({message : "user not found"})
        }
        res.json(userData)
    }catch(err){
        res.status(500).json({message : "Server error",error : err.message})
    }
}

///get user profile ; 
/// @route PUT /api/auth/profile
// @ private ; require jwt
const updateUserProfile = async (req,res) => {
    try{
         const user = await User.findById(req.user.id);
         if (!user) {
            return res.status(404).json({message :"user not found"})
         }

         user.name = req.body.name || user.name
         user.email = req.body.email || user.email

         if(req.body.password){
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(req.body.password , salt)

         }
         const updatedUser = await user.save()

         res.json({
            _id : updatedUser._id,
            name : updatedUser.name,
            email : updatedUser.email,
            role : updatedUser.role,
            token : generateToken(updatedUser._id)
         })
    }catch(err){
        res.status(500).json({message : "Server error",error : err.message})
    }
}


module.exports  = { registerUser,loginUser,getUserProfile,updateUserProfile}

