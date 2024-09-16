import React, { useState, useEffect, createContext } from "react";
// #manages the global state, and API calls here

// provider: send the data out; Context API
// pass function that changes state from here.
const Context = createContext(null); // creates context object, iniital value:null.

const MyProvider = ({ children }) => {
  const [shipments, setShipments] = useState([]);
  const [showAddContainerForm, setShowAddContainerForm] = useState(false);
  const [selectedShipmentId, setSelectedShipmentId] = useState(null);
  const [selectedContainerId, setSelectedContainerId] = useState(null);
  const [containerByNumber, setContainerByNumber] = useState(null);

  useEffect(() => {
    // Fetch shipments data from API
    fetch("/shipments")
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else {
          alert("No shipment data found.");
        }
      })
      .then((shipmentData) => {
        setShipments(shipmentData);
      })
      .catch((error) => console.error("Error:", error));
  }, []);

  // add container POST request to /containers, status 201 update state, else: return error
  const addContainer = (container) => {
    fetch("/containers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...container, shipment_id: selectedShipmentId }),
    })
      .then((response) => {
        if (response.status === 201) {
          // If the status code is 201 (Created), proceed with the response
          return response.json();
        } else {
          // If not 201, throw an error to handle in the catch block
          alert(`Unexpected response status: ${response.status}`);
        }
      })
      .then((containerData) => {
        // Handle successful addition (update shipments)
        setShowAddContainerForm(!showAddContainerForm); // Hide the form after adding

        // Update shipments state
        setShipments((prevShipments) =>
          prevShipments.map((shipment) =>
            shipment.id === selectedShipmentId
              ? {
                  ...shipment,
                  containers: [...shipment.containers, containerData], // Add the new container from the server response
                }
              : shipment
          )
        );
      })
      .catch((error) => {
        // Handle errors and alert the user
        console.error("Error:", error);
        alert("Failed to add container. Please try again.");
      });
  };

  console.log(shipments);

  const deleteContainer = (containerId, shipmentId) => {
    fetch(`/containers/${containerId}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (res.status === 204) {
          alert("The container is deleted successfully.");
          // Skip res.json() if there's no content returned
          return res.status === 204 ? null : res.json();
        } else {
          alert(`Failed to delete container. Status: ${res.status}`);
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

  const updateContainer = (containerData) => {
    // Send PATCH request to the backend /containers/id
    console.log(containerData);
    // {container_number: 'CBHU320323', container_type: '40HC', shipment_id: 1}

    fetch(`/containers/${containerData.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(containerData),
    })
      .then((res) => {
        if (res.ok) {
          return res.json(); // Parse the JSON response
        } else {
          alert(`Unexpected response status: ${res.status}`);
        }
      })
      .then((data) => {
        console.log("Updated container data:", data);

        // Update state with response data
        setShipments((prevShipments) =>
          prevShipments.map((shipment) =>
            shipment.id === containerData.shipment_id
              ? {
                  ...shipment,
                  containers: shipment.containers.map((c) =>
                    c.id === containerData.id
                      ? { ...c, ...data } // Use response data for updated container
                      : c
                  ),
                }
              : shipment
          )
        );

        setSelectedContainerId(null);
        setSelectedShipmentId(null);
        alert("The container has been successfully updated.");
      })
      .catch((error) => {
        console.error("Error updating container:", error);
        alert("Failed to update the container.");
      });
  };

  // searchContainer function to get Container by cont number. matching containers returns the container.

  function searchContainer(data) {
    console.log(data)
    //format user input
    const upperCaseContainerNumber = data.container_number.toUpperCase();

    // Iterate through shipments to find the container and its associated shipment
    let matchingContainerWithShipment;
    // for each shipment  find the matching container and return its associated shipment.
    shipments.forEach((shipment) => {
      const matchingContainer = shipment.containers.find(
        (container) =>
          container.container_number.toUpperCase() === upperCaseContainerNumber
      );

      if (matchingContainer) {
        matchingContainerWithShipment = {
          shipment: shipment, // Store the shipment
          container: matchingContainer, // Store the matching container
        };
      }
    });

    // update state if container is found.
    if (matchingContainerWithShipment) {
      setContainerByNumber(matchingContainerWithShipment);
    } else {
      alert("No matching container found.");
      setContainerByNumber(null);
    }
  }

  return (
    <Context.Provider
      value={{
        shipments,
        showAddContainerForm,
        setShowAddContainerForm,
        selectedShipmentId,
        setSelectedShipmentId,
        addContainer,
        deleteContainer, // delete handler for Delete button click
        updateContainer,
        selectedContainerId,
        setSelectedContainerId, // update selectedContainerId when container is clicked for editing
        searchContainer,
        containerByNumber, // container by number state for search functionality.
        setContainerByNumber,
      }}
    >
      {children}
    </Context.Provider>
  );
};

// value={{ shipments }} creates an object like { shipments: [...] }
export { MyProvider, Context };
