import React from "react";
import "./index.css";
import NavBar from "./NavBar";
import logo from "./assests/logo.jpg";
import { useNavigate, Outlet, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";


// Tailwind utility class for header.
function App() {
  const navigate = useNavigate(); // useNavigate hook returns a function that lets you navigate programmatically.
  // navigate(-1) : is equals to hitting back button.

  console.log("App is rendering");
  const [shipments, setShipments] = useState([]);
  const [customer, setCustomer] = useState(null);
  const [customerShipments, setCustomerShipments] = useState([]);
  // if customer's initial state is null,not logged in. {username: username}

  // get customer data from the backend , check session to see if customer is already logged in when the component is first mounted. (every time we refresh the page, this code runs to check if they are logged in)
  useEffect(() => {
    fetch("/check_session").then((response) => {
      if (response.ok) {
        response.json().then((customer) => {
          // if customer is logged in, their data is fetched and stored in the customer state.
          setCustomer(customer);
          navigate("/"); // navigates to home page
        });
      } else if (response.status === 401) {
        response.json().then((errData) => alert(`Error: ${errData.error}`));
        navigate("/login"); // redirect to login page, error property i coming from error property in API.
      }
    });
  }, [navigate]);

  console.log("session check completed");

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
  }, [customer]);

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

  function handleUpdate(comment, shipment_id) {
    // Check if the customer object exists and has an id
    if (customer && customer.id) {
      fetch(`/shipments/customer/${customer.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ comment, shipment_id }), //  necessary fields
      })
        .then((response) => {
          if (response.ok) {
            return response.json(); // Parse JSON if the response is okay
          } else {
            return response.json().then((error) => {
              console.error("Failed to update shipment:", error);
              alert(
                "Failed to update shipment, or the shipment does not exist."
              );
            });
          }
        })
        .then((data) => {
          console.log("Shipment updated successfully:", data);
        })
        .catch((error) => {
          console.error("Error:", error);
          alert(error.message);
        });
    } else {
      console.error("Customer not found or not logged in.");
    }
  }

  // handle DELETE request here /shipments/customer/id
  function handleDelete(id) {
    console.log(id);

    if (customer && customer.id) {
      fetch(`/shipments/customer/${customer.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }), // Sending shipment ID in request body
      }).then((res) => {
        if (res.ok) {
          console.log("Shipment deleted successfully.");
          alert("Shipment deleted successfully");
          console.log(customerShipments);
          // Update shipments state by filtering out the deleted shipment
          setCustomerShipments((prevShipments) => {
            const updatedShipments = prevShipments.filter(
              (shipment) => shipment.id !== id
            );
            console.log("Updated shipments:", updatedShipments); // Confirm the updated state
            return updatedShipments; 
          });
          console.log(customerShipments);
          return res.json(); // Return response JSON to the next .then (if needed)
        } else {
          alert("Failed to delete shipment");
        }
      });
    } else {
      console.error("Customer not found or not logged in.");
    }
  }

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

  //POST request for shipment booking.

  function bookShipment(shipmentData) {
    console.log(shipmentData);

    if (customer && customer.id) {
      fetch(`/shipments/customer/${customer.id}`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(shipmentData),
      })
        .then((res) =>
          res.json().then((data) => ({ status: res.status, body: data }))
        )
        .then(({ status, body }) => {
          if (status === 201) {
            alert("Shipment booked successfully!");
            console.log(customer.credit_amount);
            //update state
            setCustomerShipments((prev) => [...prev, body]);
            // console.log(customerShipments)
            // update customer's credit amount
            setCustomer((prev) => ({
              ...prev,
              credit_amount: Math.round(
                prev.credit_amount - body.total_cost)// rounded to 2 decimal points.
            }));
            navigate("/");
          } else if (
            status === 404 &&
            body.error === "No existing shipment found with the given criteria."
          ) {
            alert(
              "Error: No shipment found matching the given criteria. Please try again with different details."
            );
          } else if (
            status === 409 &&
            body.error === "Shipment is currently not available to book."
          ) {
            alert(
              "Error: The shipment is currently in transit and not available for booking. Please try again later."
            );
          } else {
            alert("Error: Unable to book shipment. Please try again later!");
          }
        });
    }
  }


  function handleAccountUpdate(values) {
    console.log(values);

  // If customer is logged in, send a PATCH request to '/customer/id'
    if (customer) {
      fetch(`/customer/${customer.id}`, {
        method: "PATCH",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })
        .then((response) => {
          if (response.ok) {
            return response.json(); // Parse JSON response
          } else {
            alert("Failed to update account");
          }
        })
        .then((customerData) => {
          alert("Account updated successfully!");
          // Update customer state with the returned data from the server
          setCustomer((prev) => ({ ...prev, ...customerData }));
        })
        .catch((error) => {
          alert("Error: Unable to update account. Please try again later!");

        });
    }
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
      <Outlet
        context={{
          shipments,
          logInCustomer,
          customer,
          customerShipments,
          bookShipment,
          handleUpdate,
          handleDelete,
          handleAccountUpdate
        }}
      />
    </>
  );
}

export default App;
