import { Link } from "react-router-dom";
import NewsSection from "../components/NewsSection.js";
// import Buttons from "./Buttons";
import React, { useContext } from "react";
import { Context } from "../context/Context.js"; // Import the context
import Containers from "../components/Containers.js"; // Import the Containers component
import AddContainerButton from "../components/AddContainerButton.js";
import AddContainerForm from "../components/AddContainerForm.js";

function Home() {
  // use useContext hook to access shipments data from Context.
  const {
    selectedShipmentId,
    shipments,
    showAddContainerForm,
  } = useContext(Context);

// condiitionally renders the form and button if addContainer button is clicked.

  // flexbox with 2 columns for news section and dashboard.
  return (
    <div className="flex space-x-6 pt-4 pb-4">
      {/* Dashboard */}
      <div className="bg-white shadow-lg rounded-lg p-11 w-2/3">
        <h2 className="text-xl font-semibold text-blue-900 mb-4">
          Your Dashboard
        </h2>
        <div className="space-y-4">
          {/* Upcoming Shipments */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h3 className="text-lg font-medium text-blue-900">
              Upcoming Shipments
            </h3>
            {shipments.length > 0 ? (
              shipments.map((shipmentObj) => (
                <div
                  key={shipmentObj.id}
                  className="bg-white shadow-md p-4 mb-2 rounded-lg border border-gray-300"
                >
                  <span className="text-md font-semibold text-gray-700">
                    Status: {shipmentObj.status}, Arrival:{" "}
                    {shipmentObj.arrival_time}, Route: {shipmentObj.origin} to{" "}
                    {shipmentObj.arrival_port}
                  </span>
                  {/* Show AddContainerForm only for the selected shipment */}
                  {selectedShipmentId === shipmentObj.id &&
                  showAddContainerForm ? (
                    <AddContainerForm />
                  ) : (
                    <AddContainerButton
                      shipmentId={shipmentObj.id}
                    />
                  )}

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
              to="/add_shipment"
              className="bg-gray-700 text-white py-2 px-4 rounded-lg hover:bg-blue-900"
            >
              Add new shipment
            </Link>
            <Link
              to="/shipments"
              className="bg-gray-700 text-white py-2 px-4 rounded-lg hover:bg-blue-900"
            >
              View Shipments
            </Link>
          </div>
        </div>
      </div>
      {/* News Section */}
      <NewsSection />
    </div>
  );
}

export default Home;

// Clicking on Add Container for a specific shipment sets selectedShipmentId to the ID of that shipment and opens the form for that shipment only.
// If the shipment is not the selected one, the form will not be shown.
