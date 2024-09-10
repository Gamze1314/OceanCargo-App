import React, { useState, useEffect, createContext } from "react";
// #manage global state, and API calls here

// provider: send the data out; Context API
// pass function that changes state from here.
const Context = createContext(null); // creates context object, iniital value:null.

const MyProvider = ({ children }) => {
  const [shipments, setShipments] = useState([]);
  const [showAddContainerForm, setShowAddContainerForm] = useState(false);
  const [selectedShipmentId, setSelectedShipmentId] = useState(null);

  useEffect(() => {
    // Fetch shipments data from API
    fetch("/shipments")
      .then((response) => {
        if(response.status === 200) {
          return response.json();
        } else {
          alert("No shipment data found.")
      }})
      .then((shipmentData) => {
        setShipments(shipmentData);
      })
      .catch((error) => console.error("Error:", error));
  }, []);

  // console.log(selectedShipmentId);
  // console.log(showAddContainerForm);

  // add container POST request to /containers
  const addContainer = (container) => {
    fetch("/containers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...container, shipment_id: selectedShipmentId }),
    })
      .then((response) => response.json())
      .then((data) => {
        // Handle successful addition ( update shipments)
        console.log("Container added:", data);
        setShowAddContainerForm(false); // Hide the form after adding
        // Update shipments state
        // Find the shipment to which the new container belongs
        setShipments((prevShipments) =>
          prevShipments.map((shipment) =>
            shipment.id === selectedShipmentId
              ? {
                  ...shipment,
                  containers: [...shipment.containers, container], // Add the new container to the shipment
                }
              : shipment
          )
        );
      })
      .catch((error) => console.error("Error:", error));
  };


const deleteContainer = (containerId, shipmentId) => {
  fetch(`/containers/${containerId}`, {
    method: "DELETE",
  })
    .then((res) => {
      if (res.status === 204) {
        alert("The container is deleted successfully.");
        // Skip res.json() if there's no content returned
        return res.status === 204 ? null : res.json();
      }
    })
    .then(() => {
      // Update shipments state
      setShipments((prevShipments) =>
        prevShipments.map((shipment) =>
          shipment.id === shipmentId
            ? {
                ...shipment,
                containers: shipment.containers.filter(
                  (container) => container.id !== containerId
                ),
              }
            : shipment
        )
      );
    })
    .catch((error) => console.error("Error:", error)); // Handle any errors
};


  return (
    <Context.Provider
      value={{
        shipments,
        showAddContainerForm,
        setShowAddContainerForm,
        selectedShipmentId,
        setSelectedShipmentId,
        addContainer,
        deleteContainer // delete handler for Delete button click
      }}
    >
      {children}
    </Context.Provider>
  );
};

// value={{ shipments }} creates an object like { shipments: [...] }
export { MyProvider, Context };
