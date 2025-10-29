import React from 'react'
import { Outlet } from 'react-router-dom'
import SideBar from './SideBar'

const Layout = () => {
  return (
    <div className="flex h-screen">
      <SideBar />
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  )
}
export default Layout