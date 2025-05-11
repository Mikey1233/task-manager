import React from 'react'
import { Outlet } from 'react-router-dom'

function PrivateRoute({allowedRoles}) {
  return (
    <div>
   
          
    <Outlet/>
    </div>
     
  )
}

export default PrivateRoute