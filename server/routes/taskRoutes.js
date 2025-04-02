const express = require("express")
const router = express.Router()
const {adminOnly,protect} = require("../middlewares/authMiddleware")

router.get("/",protect,getTasks)  // get all tasks {Admin: all , User : assigned}
router.get("/user-dashboard-data",protect,getUserDashboardData)
router.get("/dashboard-data",protect,getDashboardData)
router.get("/:id",protect,getById)
router.post("/",protect,adminOnly,createTask)
router.put("/:id",protect,updateTask)
router.delete("/:id",protect,adminOnly,deleteTask)
