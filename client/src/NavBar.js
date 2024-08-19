// Navigation bar includes Home link, Book Shipment Link, My profile, About Us and Log Out.
import React from "react";
import { NavLink, Navigate } from "react-router-dom";

function NavBar({ logo, customer, logOutCustomer }) {
  console.log(customer);

  const linkClasses =
    "hover:underline text-blue-900 text-md font-light-Times New Roman";

  // tailwind flex utility class to position Links to left.

  // if customer is logged in show  all the links, else show log in link

  return (
    <div className="flex md:flex md:flex-grow flex-row justify space-x-1">
      <img src={logo} alt="logo" style={{ height: "70px", width: "auto" }} />
      {customer ? (
        <nav className="flex space-x-8 justify-between items-center p-4">
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
          <NavLink to="/aboutus" className={linkClasses}>
            About us
          </NavLink>
          <NavLink
          onClick={() => logOutCustomer()}
          to="logout" className={linkClasses}>
            Log Out
          </NavLink>
        </nav>
      ) : (
        <Navigate to="/login" /> // Redirect to login if not logged in
      )}
    </div>
  );
}

export default NavBar;
