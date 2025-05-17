import React from "react";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import PrivateRoute from "./routes/PrivateRoute";
import Dashboard from "./pages/Admin/Dashboard";
import ManageTasks from "./pages/Admin/ManageTasks";
import ManageUsers from "./pages/Admin/ManageUsers";
import CreateTasks from "./pages/Admin/CreateTasks";
import UserDashboard from "./pages/User/UserDashboard";
import MyTasks from "./pages/User/MyTasks";
import ViewTaskDetails from "./pages/User/ViewTaskDetails";
// import { Link } from "react-router-dom";
import UserProvider from "./context/userContext";
import Root from "./Root";
function App() {
  return (
    <UserProvider>
 <div>
     

      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

         
          {/* Admin routes */}
          <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
            <Route path="admin/dashboard" element={<Dashboard />} />
            <Route path="admin/task" element={<ManageTasks />} />
            <Route path="admin/users" element={<ManageUsers />} />
            <Route path="admin/create-task" element={<CreateTasks />} />
          </Route>
          {/* User routes */}
          <Route element={<PrivateRoute allowedRoles={["user"]} />}>
            <Route path="user/dashboard" element={<UserDashboard />} />
            <Route path="user/my-tasks" element={<MyTasks />} />
            <Route path="user/task-details/:id" element={<ViewTaskDetails />} />
          </Route>
           {/* {Defualt route test} */}
          <Route path="/" element={<Root/>}/>
        </Routes>
      </Router>
    </div>
    </UserProvider>
   
  );
}

export default App;
