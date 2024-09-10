import "./index.css";
import NavBar from "./components/NavBar.js";
import logo from "./assests/logo.jpg";
import Home from "./pages/Home.js"
// use useContext hook to shipments data
import { useContext } from "react";
import { Context } from "./context/Context.js"; // Import Context


function App() {
  // const navigate = useNavigate(); // useNavigate hook returns a function that lets you navigate programmatically.
  const context = useContext(Context);

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
          <Home context={context}/>
        </>
      )
}

export default App;


