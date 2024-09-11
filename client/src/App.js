import "./index.css";
import NavBar from "./components/NavBar.js";
import logo from "./assests/logo.jpg";
// use useContext hook to shipments data
import { Outlet } from "react-router-dom";


function App() {

  return (
        <>
          <div>
            <header className="bg-gray-800 text-1xl text-blue-400 flex justify-center items-center p-2 hover:underline">
              There is always a new way to keep your goods moving!
            </header>
            <NavBar
              logo={logo}
            />
          </div>
          <h1 className="flex justify-center items-center min-h bg-blue-300 text-semibold hover:text-red-500">
            Manage your shipments effortlessly..
          </h1>
          <Outlet />
        </>
      )
}

export default App;


