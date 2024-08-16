// Navigation bar includes Home link, Book Shipment Link, My profile, About Us and Log Out.
import React from "react";
import { NavLink } from "react-router-dom";

function NavBar({ logo }) {
  const linkClasses =
    "hover:underline text-blue-900 text-md font-light-Times New Roman";

  // tailwind flex utility class to position Links

  return (
    <div className="flex justify-between items-center p-4">
      <img
        src={logo}
        alt="logo"
        style={{ height: "70px", width: "auto" }}
      ></img>
      <nav className="flex space-x-8">
        <NavLink to="/" className={linkClasses}>
          Home
        </NavLink>
        <NavLink to="/book_shipment" className={linkClasses}>
          Book Shipment
        </NavLink>
        <NavLink to="/profile" className={linkClasses}>
          My Profile
        </NavLink>
        <NavLink to="/shipments" className={linkClasses}>
          Shipments
        </NavLink>
      </nav>
      <nav className="ml-auto flex space-x-5">
        {/* <input
          id="search"
          type="search"
          placeholder="Search"
          class="form-input w-full appearance-none rounded border border-blue-400 bg-white py-1 pl-9 text-sm text-gray-500 placeholder-gray-400 focus:border-cyan-600 focus:outline-none xxs:pr-4"
        /> */}
        <NavLink to="/aboutus" className={linkClasses}>
          About Us
        </NavLink>
        <NavLink to="/login" className={linkClasses}>
          Log In
        </NavLink>
        {/* <button>Dark Mode Button</button> */}
      </nav>
    </div>
  );
}

export default NavBar;
