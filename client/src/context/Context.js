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
      .then((res) => {
        if (res.ok) {
          return res.json().then(setShipments);
        } else {
          res.json().then((error) => console.log(error));
        }
      })
      .catch((err) => {
        console.error("Error fetching shipments:", err); // Catch any network or parsing errors, or other exceptions
        alert("There was an error fetching the shipments.");
      });
  }, []); // effect runs only once.

  // add container POST request to /containers, status 201 update state, else: return error(< Add Container Form)
  const addContainer = (container) => {
    fetch("/containers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...container, shipment_id: selectedShipmentId }),
    })
      .then((res) => {
        if (res.ok) {
          // If the status code is 201 (Created), proceed with the response
          return res.json().then((container) => {
            // Handle successful addition (update shipments)
            setShowAddContainerForm(!showAddContainerForm); // Hide the form after adding
            // Update shipments state
            setShipments((prev) =>
              prev.map((shipment) =>
                shipment.id === selectedShipmentId
                  ? {
                      ...shipment,
                      containers: [...shipment.containers, container],
                    }
                  : shipment
              )
            );
            alert("New container is added.");
          });
        } else {
          // If not ok, log the error to handle in the catch block
          res.json().then((errors) => console.log(errors.message));
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Failed to add container. Please try again later.");
      });
  };

  console.log(shipments);

  const deleteContainer = (containerId, shipmentId) => {
    fetch(`/containers/${containerId}`, {
      method: "DELETE",
    })
      .then((res) => {
        console.log(res)
        if (res.ok) {
          alert("The container is deleted successfully.");
          // Skip res.json() if there's no content returned
          res.json().then(() => {
            // Update shipments state
            setShipments((prev) =>
              prev.map((shipment) =>
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
          });
        } else {
          res.json().then((errors) => console.log(errors.message));
          alert("Failed to delete container");
        }
      })
      .catch((error) => console.error("Error:", error)); // Handle any errors
  };

  const updateContainer = (container) => {
    // Send PATCH request to the backend /containers/id
    // {container_number: 'CBHU320323', container_type: '40HC', shipment_id: 1}

    fetch(`/containers/${container.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(container),
    }).then((res) => {
      if (res.ok) {
        // 200-299 range => True
        return res.json().then((data) => {
          console.log("Updated container data:", data);

          // Update state with response data
          setShipments((prev) =>
            prev.map((shipment) =>
              shipment.id === container.shipment_id
                ? {
                    ...shipment,
                    containers: shipment.containers.map((c) =>
                      c.id === container.id
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
        });
      } else {
        res.json().then((errors) => console.log("Error", errors));
        alert(`Unexpected response status: ${res.status}`);
      }
    });
  };

  // searchContainer function to get Container by cont number. matching containers returns the container.

  function searchContainer(data) {
    console.log(data);
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
