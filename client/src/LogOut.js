import React from 'react'
import { useNavigate } from "react-router-dom";

function LogOut() {

  const navigate = useNavigate();

  return (
    <div>
      You have logged out successfully!
      {/* navigate user to login page */}
      <button onClick={() => navigate("/login")}>Login</button>
    </div>
  )
}

export default LogOut