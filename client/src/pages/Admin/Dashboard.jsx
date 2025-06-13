import { useContext, useEffect, useState } from "react";
import { useUserAuth } from "../../hooks/useUserAuth";
import { UserContext } from "../../context/userContext";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import moment from "moment";
import { addThousandsSeperator } from "../../utils/helper";
// import { IoMdCard } from "react-icons/io";
import TaskListTable from "../../components/TaskListTable";
import InfoCard from "../../components/InfoCard";
import { LuArrowRight } from "react-icons/lu";
import CustomPieChart from "../../components/charts/CustomPieChart";
import CustomBarChart from "../../components/charts/CustomBarChart";
const COLORS = ["#8D51FF", "#00BBDB", "#7BCE00"];

function Dashboard() {
  useUserAuth();
  // const {user} = useContext(UserContext)
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  // graphs and pie chart data

  const [dashboardData, setDashboardData] = useState(null);
  const [pieChartData, setPieChartData] = useState([]);
  const [barChartData, setBarChartData] = useState([]);

  //prepare chart data

  const prepareChartData = (data) => {
    const taskDistribution = data?.taskDistribution || null;
    const taskPriorityLevels = data?.taskPriorityLevels || null;

    const taskDistributionData = [
      { status: "Pending", count: taskDistribution?.Pending || 0 },
      { status: "In Progress", count: taskDistribution?.InProgress || 0 },
      { status: "Completed", count: taskDistribution?.Completed || 0 },
    ];

    setPieChartData(taskDistributionData);
    const PriorityLevelData = [
      { priority: "Low", count: taskPriorityLevels?.Low || 0 },
      { priority: "Medium", count: taskPriorityLevels?.Medium || 0 },
      { priority: "High", count: taskPriorityLevels?.High || 0 },
    ];

    setBarChartData(PriorityLevelData);
  };

  //get dashboard data
  const getDashboardData = async () => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.TASKS.GET_DASHBOARD_DATA
      );
      if (response.data) {
        setDashboardData(response.data);
        // console.log(response.data)
        prepareChartData(response.data?.charts || null);
      }
    } catch (error) {
      console.error("Error in fetching users", error);
    }
  };

  const onSeeMore = () => {
    navigate("/admin/tasks");
  };

  useEffect(() => {
    getDashboardData();

    return () => {};
  }, []);

  return (
    <DashboardLayout activeMenu={"Dashboard"}>
      <div className="card my-5">
        <div>
          <div className="col-span-3">
            <h2 className="text-xl md:text-2xl">
              Good Morning! {user?.name.split(" ")[0]}
            </h2>
            <p className="text-xs md:text-[11px] text-gray-400 mt-1.5">
              {moment().format("dddd Do MMM YYYY")}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 my-2">
            <InfoCard
              //  icon={<IoMdCard/>}
              label="Total "
              value={addThousandsSeperator(
                dashboardData?.charts?.taskDistribution?.All || 0
              )}
              color="bg-main"
            />
            <InfoCard
              //  icon={<IoMdCard/>}
              label="Pending Tasks "
              value={addThousandsSeperator(
                dashboardData?.charts?.taskDistribution?.Pending || 0
              )}
              color="bg-violet-500"
            />
            <InfoCard
              //  icon={<IoMdCard/>}
              label="In Progress Tasks"
              value={addThousandsSeperator(
                dashboardData?.charts?.taskDistribution?.InProgress || 0
              )}
              color="bg-cyan-500"
            />
            <InfoCard
              //  icon={<IoMdCard/>}
              label="Completed Tasks "
              value={addThousandsSeperator(
                dashboardData?.charts?.taskDistribution?.Completed || 0
              )}
              color="bg-lime-500"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols gap-6 my-4 md:my-4">
        <div>
          <div className="card">
            <div className="flex items-center justify-between">
              <h5 className="font-medium">Task Distribution</h5>
            </div>

            <CustomPieChart data={pieChartData} colors={COLORS} />
          </div>
        </div>
        <div>
          <div className="card">
            <div className="flex items-center justify-between">
              <h5 className="font-medium">Task Priority Levels</h5>
            </div>

            <CustomBarChart data={barChartData}/>
          </div>
        </div>
        <div className="md:col-span-2">
          <div className="card">
            <div className="flex items-center justify-between">
              <h5 className="card-btn">Recent Tasks</h5>

              <button className="card-btn" onClick={onSeeMore}>
                See All <LuArrowRight className="text-base" />
              </button>
            </div>
            <TaskListTable tableData={dashboardData?.recentTasks || []} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Dashboard;
