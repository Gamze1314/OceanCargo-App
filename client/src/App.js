import React from "react";
import NavBar from "./NavBar";
import logo from "./assests/logo.jpg";
import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react"

// Tailwind utility class for header.
function App() {
  console.log("App is rendering");
  const [shipments, setShipments] = useState([])


  useEffect(() => {
    // fetch shipments data from API
    fetch('/shipments')
     .then(response => response.json())
     .then(shipmentData => {
      // console.log(data) array ; ttl 10 shipments.
      setShipments(shipmentData)
     })
  }, [])


  return (
    // use fragment for rendering
    <>
    <div>
      <header className="bg-gray-800 text-1xl text-blue-400 flex justify-center items-center p-2 hover:underline">
        There is always a new way to keep your goods moving!
      </header>
      <NavBar logo={logo} />
      {/* <header className="text-2xl text-blue-800 ">Welcome</header> */}
    </div>
    <Outlet context={shipments} />
    </>
  );
}

export default App;
