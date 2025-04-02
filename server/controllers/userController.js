const Task = require("../models/Task")
const User = require("../models/User")
const bcrypt = require("bcryptjs")

// const getUsers = async (req,res)=>{
//    try{
//    const users = await User.find({role:"member"}).select("-password");
//    const userWithTaskCounts = await Promise.all(users.map(async (user)=> {
//      const pendingTasks = await Task.countDocuments({assignedTo : user._id,status : "Pending"})
//      const inProgressTasks = await Task.countDocuments({assignedTo : user._id,status : "In Progress"})
//      const completedTasks = await Task.countDocuments({assignedTo : user._id,status : "Completed"})
//   return {
//       ...user._doc,
//       pendingTasks,
//       inProgressTasks,
//       completedTasks
//      }

//    }))

//    res.json(userWithTaskCounts)
//    }catch(error){
//    res.status(500).json({message : "Server Error",error : error.message})   
//    } 
// }

// Thank God for ChatGpt ,this function improved the codebase significantly
const getUsers = async (req, res) => {
    try {
       const usersWithTaskCounts = await User.aggregate([
          { $match: { role: "member" } }, // Get only members
          {
             $lookup: {
                from: "tasks", // Join with the Task collection
                localField: "_id",
                foreignField: "assignedTo",
                as: "tasks"
             }
          },
          {
             $addFields: {
                pendingTasks: { $size: { $filter: { input: "$tasks", as: "task", cond: { $eq: ["$$task.status", "Pending"] } } } },
                inProgressTasks: { $size: { $filter: { input: "$tasks", as: "task", cond: { $eq: ["$$task.status", "In Progress"] } } } },
                completedTasks: { $size: { $filter: { input: "$tasks", as: "task", cond: { $eq: ["$$task.status", "Completed"] } } } }
             }
          },
          { $project: { password: 0, tasks: 0 } } // Exclude password and task array
       ]);
 
       res.json(usersWithTaskCounts);
    } catch (error) {
       res.status(500).json({ message: "Server Error", error: error.message });
    }
 };
 

const getUserById = async (req,res) => {
    try{
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({message : "User not found"})
        res.json(user)
    }catch(error){
    res.status(500).json({message : "Server Error",error : error.message})   
    } 
}

const deleteUser = async(req,res)=>{
    try{
    const findUserAndDelete = await User.findByIdAndDelete(req.params.id)
    res.status(200).json(findUserAndDelete)
    }catch(error){
    res.status(500).json({message : "Server Error",error : error.message})   
    } 
}

module.exports = { getUsers,getUserById,deleteUser}