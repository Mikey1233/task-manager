const { model } = require("mongoose");
const Task = require("../models/Task");

///get all task ,(Admin all, user - only assigned)
const getTasks = async (req, res) => {
  try {
    const { status } = req.query;
    let filter = {};
    if (status) {
      filter.status = status;
    }

    let tasks;
    if (req.user.role === "admin") {
      tasks = await Task.find(filter).populate(
        "assignedTo",
        "name email profileImageUrl"
      );
    } else {
      tasks = await Task.find({ ...filter, assignedTo: req.user._id }).populate(
        "assignedTo",
        "name email profileImageUrl"
      );
    }

    tasks = await Promise.all(
      tasks.map(async (task) => {
        const completedCount = task.todoCheckLists.filter(
          (item) => item.completed
        ).length;
        return { ...task._doc, completedTodoCount: completedCount };
      })
    );
    ///status memory cound
    const alltasks = await Task.countDocuments(
      req.user.role === "admin" ? {} : { assignedTo: req.user._id }
    );
    const pendingTasks = await Task.countDocuments({
      ...filter,
      status: "Pending",
      ...(req.user.role !== "admin" && { assignedTo: req.user._id }),
    });

    const isProgressTasks = await Task.countDocuments({
      ...filter,
      status: "In Progress",
      ...(req.user.role !== "admin" && { assignedTo: req.user._id }),
    });
    const completedTasks = await Task.countDocuments({
      ...filter,
      status: "Completed",
      ...(req.user.role !== "admin" && { assignedTo: req.user._id }),
    });

    res.json({
      tasks,
      statusSummary: {
        all: alltasks,
        pendingTasks,
        isProgressTasks,
        completedTasks,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

//private route
const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate(
      "assignedTo",
      "name email profileImageUrl"
    );
    if (!task) return res.status(404).json({ message: "Task NOt Found" });
    res.json(task);
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
      todoCheckLists,
    } = req.body;
    if (!Array.isArray(assignedTo)) {
      return res
        .status(400)
        .json({ message: "assignedTO must be an array of user ID's" });
    }
    const task = await Task.create({
      title,
      description,
      assignedTo,
      attachments,
      todoCheckLists,
      priority,
      dueDate,
    });

    res.status(201).json({ message: "task successfuly created", task });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
// private route
const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task Not Found" });

    task.title = req.body.title || task.title;
    task.description = req.body.title || task.title;
    task.priority = req.body.priority || task.priority;
    task.dueDate = req.body.dueDate || task.dueDate;
    task.todoCheckLists = req.body.todoCheckLists || task.todoCheckLists;
    task.attachments = req.body.attachments || task.attachments;

    if (req.body.assignedTo) {
      if (!Array.isArray(req.body.assignedTo)) {
        return res.status(400).json({
          message: "asssignedTo must be an array of user IDs",
        });
      }
      task.assignedTo = req.body.assignedTo;
    }
    const updatedTask = await task.save();
    res.json({ message: "task updated succesfully", updatedTask });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
/// private route
const updateTaskStatus = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task Not Found" });

    const isAssigned = task.assignedTo.some(
      (userId) => userId.toString() === req.user._id.toString()
    );
    if (!isAssigned && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorised" });
    }
    task.status = req.body.status || task.status;
    if (task.status === "Completed") {
      task.todoCheckLists.forEach((item) => {
        item.completed = true;
      });
      task.progress = 100;
    }
    await task.save();
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
/// private route
const updateTaskCheckList = async (req, res) => {
  try {
    const { todoCheckLists } = req.body;
    const task = Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task NOt Found" });
    if (!task.assignedTo.includes(req.user._id) && req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Not authorised to update Checklist" });
    }

    task.todoCheckLists = todoCheckLists;

    const completedCount = task.todoCheckLists.filter(
      (item) => item.completed
    ).length;
    const totalItems = task.todoCheckLists.length;
    task.progress =
      totalItems > 0 ? Math.round((completedCount / totalItems) * 100) : 0;

    if (task.progress === 100) {
      task.status = "Completed";
    } else if (task.progress > 0) {
      task.status = "In Progress";
    } else {
      task.status = "Pending";
    }
    await task.save();

    const updatedTask = await Task.findById(req.params.id).populate(
      "assignedTo",
      "name emai profileImageUrl"
    );
    return res.json({
      message: "taskChecklist Updated",
      updatedList: updatedTask,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
//delete private route (admin access)
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "task not found" });
    await task.deleteOne();
    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// private route
const getDashboardData = async (req, res) => {
  try {
    //fetch statistics
    const totalTasks = await Task.countDocuments();
    const pendingTasks = await Task.countDocuments({ status: "Pending" });
    const completedTasks = await Task.countDocuments({ status: "Completed" });
    const overdueTasks = await Task.countDocuments({
      status: { $ne: "Completed" },
      dueDate: { $lt: new Date() },
    });

    ///Ensure all possible statuses are inlcuded
    const taskStatuses = ["Pending", "In Progress", "Completed"];
    const taskPriorities = ["Low", "Medium", "High"];

    const taskDistributionRaw = await Task.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);
    const taskDistribution = taskStatuses.reduce((acc, status) => {
      const formattedKey = status.replace(/\s+/g, "");
      acc[formattedKey] =
        taskDistributionRaw.find((item) => item._id == status)?.count || 0;
      return acc;
    }, {});
    taskDistribution["All"] = totalTasks; //add total count to distribution;
    const taskPriorityLevelsRaw = await Task.aggregate([
      {
        $group: {
          _id: "$priority",
          count: { $sum: 1 },
        },
      },
    ]);
    const taskPriorityLevels = taskPriorities.reduce((acc, priority) => {
      acc[priority] =
        taskPriorityLevelsRaw.find((item) => item._id === priority)?.count || 0;
      return acc;
    }, {});
    //fetch
    const recentTasks = await Task.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select("title status priority dueDate createdAt");

    res.status(200).json({
      statistics: {
        totalTasks,
        pendingTasks,
        completedTasks,
        overdueTasks,
      },
      charts: {
        taskDistribution,
        taskPriorityLevels,
      },
      recentTasks,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

//private route
const getUserDashboardData = async (req, res) => {
  try {
    const userId = req.user._id;

    //fetch specific user task data
    const totalTasks = await Task.countDocuments({ assignedTo: userId });
    const pendingTasks = await Task.countDocuments({
      assignedTo: userId,
      status: "Pending",
    });
    const completedTasks = await Task.countDocuments({
      assignedTo: userId,
      status: "Completed",
    });
    const overdueTasks = await Task.countDocuments({
      assignedTo: userId,
      status: { $ne: "Completed" },
      dueDate: { $lt: new Date() },
    });

    const taskStatuses = ["Pending", "In Progress", "Completed"];
    const taskDistributionRaw = await Task.aggregate([
      { $match: { assignedTo: userId } },
      { $group: { _id: "status", count: { $sum: 1 } } },
    ]);
    const taskDistribution = taskStatuses.reduce((acc, status) => {
      const formattedKey = status.replace(/\s+/g, "");
      acc[formattedKey] =
        taskDistributionRaw.find((item) => item._id === status)?.count || 0;
      return acc;
    }, {});

    taskDistribution["All"] = totalTasks; //add total count to distribution;
    const taskPriorities = ["Low", "Medium", "High"];
    const taskPriorityLevelsRaw = await Task.aggregate([
      {
        $match: {
          assignedTo: userId,
        },
      },
      {
        $group: {
          _id: "$priority",
          count: { $sum: 1 },
        },
      },
    ]);
    const taskPriorityLevels = taskPriorities.reduce((acc, priority) => {
      acc[priority] =
        taskPriorityLevelsRaw.find((item) => item._id === priority)?.count || 0;
      return acc;
    }, {});
    //fetch
    const recentTasks = await Task.find({ assignedTO: userId })
      .sort({ createdAt: -1 })
      .limit(10)
      .select("title status priority dueDate createdAt");

    res.status(200).json({
      statistics: {
        totalTasks,
        pendingTasks,
        completedTasks,
        overdueTasks,
      },
      charts: {
        taskDistribution,
        taskPriorityLevels,
      },
      recentTasks,
    });
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
