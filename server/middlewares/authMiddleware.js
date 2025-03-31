const jwt = require("jsonwebtoken")
const User = require("../models/User")

//Middleware for protected route

const protect = async ( req,res,next) =>{
    try {
         let token = req.headers.authorization;
         if(token && token.startsWith("Bearer")){
            token = token.split(" ")[1] //extract token
            const decoded = jwt.verify(token,process.env.JWT_SECRET)
            req.user = await User.findById(decoded.id).select("-password");
            next()
         }
    }catch(err){
     res.status(401).json({message : "Token failed", error : err.message})
    }
}


// Middleware for Admin-only access

const adminOnly = async (req,res,next)=>{
  if (req.user && req.user.role == "admin"){
    next()
  }else {
    res.status(403).json({message : "Access denied , admin only"})
  }
}

module.exports = {protect,adminOnly}