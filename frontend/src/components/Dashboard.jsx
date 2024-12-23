import React from "react";
import logo from "../assets/Img/logo.png"; 

function Dashboard() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="text-center">
        <img
          alt="Digitalflake logo with text"
          src={logo} 
          className="mx-auto mb-6"
          style={{ height: "200px", width: "400px" }} 
        />
        <p className="text-gray-600">Welcome to Digitalflake admin</p>
      </div>
    </div>
  );
}

export default Dashboard;
