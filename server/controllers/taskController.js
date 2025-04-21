const { model } = require("mongoose");
const Task = require("../models/Task");

///get all task ,(Admin all, user - only assigned)
const getTasks = async (req, res) => {
  try {
  const { status } = req.query
  let filter = {}
  if (status) {
    filter.status = status
  }
  
  let tasks;
  if (req.user.role === "admin"){
    tasks = await Task.find(filter).populate(
      "assignedTo",
      "name email profileImageurl"
    )
  }else {
    tasks = await Task.find({...filter,assignedTo : req.user._id}).populate(
       "assignedTo",
      "name email profileImageurl"
    )
  }

  tasks = await Promise.all(
    tasks.map(async (task)=> {
      const completedCount = task.todoCheckLists.filter((item) => item.completed).length
      return {...task._doc, completedTodoCount : completedCount}
    })
  )
  ///status memory cound
 const alltasks = await Task.countDocuments(
  req.user.role === "admin"?{}:{assignedTo : req.user._id}
 )
 const pendingTasks = await Task.countDocuments({
  ...filter,
  status :"Pending",
  ...(req.user.role !== "admin" && {assignedTo : req.user._id})
 })

 const isProgressTasks = await Task.countDocuments({
  ...filter,
  status :"In Progress",
  ...(req.user.role !== "admin" && {assignedTo : req.user._id})
 })
 const completedTasks = await Task.countDocuments({
  ...filter,
  status :"Completed",
  ...(req.user.role !== "admin" && {assignedTo : req.user._id})
 })

 res.json({
  tasks,
  statusSummary : {
    all : alltasks,
    pendingTasks,
    isProgressTasks,
    completedTasks
  }
 })

  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

//private route
const getTaskById = async (req, res) => {
  try {
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

//private route (Admin access only)
const createTask = async (req, res) => {
  try {
    const { 
      title,
      description,
      priority,
      dueDate,
      assignedTo,
      attachments,
       todoCheckLists
    } = req.body
    if (!Array.isArray(assignedTo)){
      return res.status(400).json({message : "assignedTO must be an array of user ID's"})
    }
    const task  = await Task.create({
      title,
      description,
      assignedTo,
      attachments,
      todoCheckLists,
      priority,
      dueDate
    })

    res.status(201).json({message : 'task successfuly created',task})
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
// private route
const updateTask = async (req, res) => {
  try {
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
/// private route
const updateTaskStatus = async (req, res) => {
  try {
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
/// private route
const updateTaskCheckList = async (req, res) => {
  try {
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
//delete private route (admin access)
const deleteTask = async (req, res) => {
  try {
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// private route
const getDashboardData = async (req, res) => {
  try {
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

//private route
const getUserDashboardData = async (req, res) => {
  try {
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = {
  getTasks,
  getTaskById,
  getUserDashboardData,
  getDashboardData,
  deleteTask,
  updateTask,
  createTask,
  updateTaskCheckList,
  updateTaskStatus,
};
