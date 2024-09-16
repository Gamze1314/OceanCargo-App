import { Link } from "react-router-dom";
import NewsSection from "../components/NewsSection.js";
import React, { useContext, useEffect } from "react";
import { Context } from "../context/Context.js";
import Containers from "../components/Containers.js";
import AddContainerButton from "../components/AddContainerButton.js";
import AddContainerForm from "../components/AddContainerForm.js";

// condiitionally renders the form and button if 'addContainer' button is clicked.
function Home() {
  // use useContext hook to access shipments data from Context.
  const {
    selectedShipmentId,
    shipments,
    showAddContainerForm,
    setShowAddContainerForm,
  } = useContext(Context);

  // listen for selectedShipmentId, and showAddcontainerform changes to alert user to add container for a shipment one at a time.

  useEffect(() => {
    if (selectedShipmentId && showAddContainerForm) {
      // Trigger the alert only if a shipment is selected and the form is not currently shown
      alert("Please select one shipment at a time to add or edit a container.");
      setShowAddContainerForm(true);
    }
  }, [selectedShipmentId, showAddContainerForm, setShowAddContainerForm]);

  // flexbox with 2 columns for news section and dashboard.
  return (
    <div className="flex space-x-6 pt-4 pb-4">
      <div className="bg-white shadow-lg rounded-lg p-11 w-2/3">
        <h2 className="text-xl font-semibold text-blue-900 mb-4">
          {" "}
          Your Dashboard
        </h2>
        <div className="space-y-4">
          {/* Upcoming Shipments */}
          <div className="bg-gray-50 p-2 rounded-lg border border-gray-200">
            <h3 className="text-lg font-medium text-blue-900">
              Upcoming Shipments
            </h3>
            {shipments.length > 0 ? (
              shipments.map((shipmentObj, index) => (
                <div
                  key={shipmentObj.id}
                  className="bg-gray-60 shadow-md p-2 rounded-lg border border-gray-300"
                >
                  <div className="bg-gray-50 shadow-lg p-4 flex items-center justify-between rounded-lg border border-gray-200">
                    <h4 className="text-md font-bold text-blue-800 mb-3">
                      {index + 1}. Route: From {shipmentObj.origin} to{" "}
                      {shipmentObj.arrival_port}, USA
                    </h4>
                    <div className="text-md text-gray-800 mb-3">
                      <span className="font-semibold text-gray-600">
                        Status:
                      </span>{" "}
                      {shipmentObj.status}
                    </div>
                    <div className="text-md text-gray-800 mb-3">
                      <span className="font-semibold text-gray-600">
                        Arrival:
                      </span>{" "}
                      {shipmentObj.arrival_time}
                    </div>
                    {/* Show AddContainerForm only for the selected shipment */}
                    {selectedShipmentId === shipmentObj.id &&
                    showAddContainerForm ? (
                      <AddContainerForm />
                    ) : (
                      <AddContainerButton shipmentId={shipmentObj.id} />
                    )}
                  </div>
                  {/* Render the Containers component */}
                  <Containers
                    containers={shipmentObj.containers}
                    shipmentId={shipmentObj.id}
                  />
                </div>
              ))
            ) : (
              <p>No upcoming shipments.</p>
            )}
          </div>
          <div className="flex justify-between space-x-4">
            <Link
              to="/shipments"
              className="bg-gray-700 text-white py-2 px-4 rounded-lg hover:bg-blue-900"
            >
              View Vessel Schedules
            </Link>
          </div>
        </div>
      </div>
      <NewsSection />
    </div>
  );
}

export default Home;

// Clicking on Add Container for a specific shipment sets selectedShipmentId to the ID of that shipment and opens the form for that shipment only.
// If the shipment is not the selected, the form will not be shown. selectedShipmentId === shipmentObj.id
