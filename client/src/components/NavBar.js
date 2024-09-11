// Navigation bar includes Home link, Book Shipment Link, My profile, and Log Out.
import { NavLink } from "react-router-dom";

function NavBar({ logo }) {

  const linkClasses =
    "hover:underline text-blue-900 text-md font-light-Times New Roman";

  // tailwind flex utility class to position Links to left.

  return (
    <div className="flex md:flex md:flex-grow flex-row justify space-x-1">
      <img src={logo} alt="logo" style={{ height: "70px", width: "auto" }} />
        <nav className="flex space-x-8 justify-between items-center p-4">
          <NavLink to="/" className={linkClasses}>
            Home
          </NavLink>
          <NavLink to="/search_container" className={linkClasses}>
            Container Search
          </NavLink>
          <NavLink to="/shipments" className={linkClasses}>
            Vessel Schedule
          </NavLink>
          <NavLink to="/map" className={linkClasses}>
          Map
          </NavLink>
        </nav>
    </div>
  );
}

export default NavBar;
