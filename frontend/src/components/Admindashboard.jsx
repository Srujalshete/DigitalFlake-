import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./navbar";
import Sidebar from "./Sidebar";

const AdminDashboard = () => {
  return (
    <div>
      <Navbar />
      <div className="flex">
        <Sidebar />
        <div className="w-full p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
