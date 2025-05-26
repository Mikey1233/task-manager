import React from 'react'
import { Navigate,Outlet } from 'react-router-dom'
import { useContext } from 'react'
import { UserContext } from './context/userContext'
// import Outlet from "reac"

function Root() {
  const {user,loading} = useContext(UserContext)

  if (loading) return <Outlet/>
  if(!user) {
    return <Navigate to={"/login"}/>
  }
  return user.role === "admin" ? <Navigate to={"/admin/dashboard"}/>: <Navigate to={"/user/dashboard"}/>
}

export default Root