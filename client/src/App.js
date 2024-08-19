import React from "react";
import NavBar from "./NavBar";
import logo from "./assests/logo.jpg";
import { useNavigate, Outlet, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
//navigation hook

// Tailwind utility class for header.
function App() {
  const navigate = useNavigate();

  console.log("App is rendering");
  const [shipments, setShipments] = useState([]);
  const [customer, setCustomer] = useState(null);
  // if customer's initial state is null,not logged in. {username: username}

  // get customer data from the backend , check session to see if customer is already logged in when the component is first mounted. (every time we refresh the page, this code runs to check if they are logged in)
  useEffect(() => {
    fetch("/check_session").then((response) => {
      if (response.ok) {
        response.json().then((customer) => {
          // if customer is logged in, their data is fetched and stored in the customer state.
          setCustomer(customer);
          navigate("/");
        });
      } else if (response.status === 401) {
        response.json().then((errData) => alert(`Error: ${errData.error}`));
        navigate("/login"); // redirect to login page
      }
    });
  }, [navigate]);

  useEffect(() => {
    // fetch shipments data from API
    fetch("/shipments").then((response) => {
      if (!response.ok) {
        alert("Error fetching data from API.");
      } else {
        return response
          .json()
          .then((shipmentData) => setShipments(shipmentData));
      }
    });
  }, []);

  console.log("session check completed")

  function logInCustomer(loginData) {
    // POST request to log in customer with loginData.
    fetch("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(loginData),
    })
      //if response is ok, set state to customer data, if error is returned, alert customer
      .then((response) => {
        if (response.ok) {
          response.json().then((customerData) => {
            setCustomer(customerData);
            //navigate user to home page
            navigate("/");
          });
        } else if (response.status === 401) {
          response.json().then((err) => alert(err.error));
        }
      });
  }


  console.log("user logged in")


  return (
    <>
      <div>
        <header className="bg-gray-800 text-1xl text-blue-400 flex justify-center items-center p-2 hover:underline">
          There is always a new way to keep your goods moving!
        </header>
        <NavBar logo={logo} customer={customer} />
      </div>
      <p>Welcome to Ocean Booking Website!</p>
      {customer ? <h1>Hello {customer.username}!</h1> : null}
      {!customer ? <Navigate to="/login" /> : null}
      <Outlet context={{ shipments, logInCustomer }} />
    </>
  );
}

export default App;
