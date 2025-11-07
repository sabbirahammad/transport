import React from 'react'
import { Outlet } from 'react-router-dom'
import SideBar from './SideBar'
import Navbar from './Navbar'

const Layout = () => {
  return (
    <div className="flex h-screen">
        <SideBar />
      <div className="flex-1 flex flex-col overflow-hidden">
            <Navbar />
        <div className="flex-1 overflow-auto">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
export default Layout