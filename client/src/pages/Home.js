import { Link } from "react-router-dom";
import NewsSection from "../components/NewsSection.js";
import React, { useContext, useEffect } from "react";
import { Context } from "../context/Context.js";
import Containers from "../components/Containers.js";
import AddContainerButton from "../components/AddContainerButton.js";
import AddContainerForm from "../components/AddContainerForm.js";


function Home() {
  const {
    selectedShipmentId,
    shipments,
    showAddContainerForm,
    setShowAddContainerForm,
  } = useContext(Context);

  useEffect(() => {
    if (selectedShipmentId && showAddContainerForm) {
      alert("Please select one shipment at a time to add or edit a container.");
      setShowAddContainerForm(true);
    }
  }, [selectedShipmentId, showAddContainerForm, setShowAddContainerForm]);

  return (
    <div className="flex space-x-6 pt-4 pb-4">
      <div className="bg-white shadow-lg rounded-lg p-11 w-2/3">
        <h2 className="text-xl font-semibold text-blue-900 mb-4">
          {" "}
          Your Dashboard
        </h2>
        <div className="space-y-4">
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
                    {selectedShipmentId === shipmentObj.id &&
                    showAddContainerForm ? (
                      <AddContainerForm />
                    ) : (
                      <AddContainerButton shipmentId={shipmentObj.id} />
                    )}
                  </div>
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
