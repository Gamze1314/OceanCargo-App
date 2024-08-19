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
  const [customerShipments, setCustomerShipments] = useState([])
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

  console.log("session check completed");

  // handle API call to /shipments/customer/<int:customer_id> API call here to get a customer's shipments 
  useEffect(() => {
    // Fetch customer-specific shipments if a customer is logged in and has a valid ID
    if (customer && customer.id) {
      fetch(`/shipments/customer/${customer.id}`).then((response) => {
        if (response.ok) {
          response.json().then((shipments) => {
            // Only update state if the data is different
            setCustomerShipments((prevShipments) => {
              if (JSON.stringify(prevShipments) !== JSON.stringify(shipments)) {
                return shipments;
              }
              return prevShipments;
            });
          });
        } else {
          alert("Error fetching customer's shipments");
        }
      });
    }
  }, [customer]);



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

  console.log("user logged in");

  function logOutCustomer() {
    fetch("/logout", {
      method: "DELETE",
    }).then((res) => {
      if (res.ok) {
        setCustomer(null);
      } else {
        alert("Error: Unable to log customer out!");
      }
    });
  }

  return (
    <>
      <div>
        <header className="bg-gray-800 text-1xl text-blue-400 flex justify-center items-center p-2 hover:underline">
          There is always a new way to keep your goods moving!
        </header>
        <NavBar
          logo={logo}
          customer={customer}
          logOutCustomer={logOutCustomer}
        />
      </div>
      {customer ? (
        <h1 className="flex justify-center items-center min-h bg-gray-100 text-semibold hover: text-red-500">
          Hello {customer.username}. Welcome to Ocean Booking website!
        </h1>
      ) : null}
      {!customer ? <Navigate to="/login" /> : null}
      <Outlet context={{ shipments, logInCustomer, customer , customerShipments}} />
    </>
  );
}

export default App;
