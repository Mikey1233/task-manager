const { exportTasksReport,exportUsersReport } = require("../controllers/reportController")
const { adminOnly,protect } = require("../middlewares/authMiddleware")


const router = require("express").Router()


router.get("/export/tasks",protect,adminOnly,exportTasksReport)
router.get("/export/users",protect,adminOnly,exportUsersReport)

module.exports = router