import React from 'react'
import { useUserAuth } from '../../hooks/useUserAuth'
function Dashboard() {
  useUserAuth()
  return (
    <div>Dashboard</div>
  )
}

export default Dashboard