// display searched container details here
// containerByNumber from context
// render under Search component form.
// li for each detail.

import React, { useContext } from "react";
import { Context } from "../context/Context.js"; // Import context

const ContainerDetails = () => {
  const { containerByNumber } = useContext(Context);

  if (!containerByNumber) {
    return <p>Loading...</p>;
  }

  // Destructure properties with fallback values, alternative values.
  const {
    container_number = "N/A",
    container_type = "N/A",
    total_cost = "N/A",
    arrival_port = containerByNumber.shipment.arrival_port
      ? containerByNumber.shipment.arrival_port
      : "N/A",
    origin = containerByNumber.shipment.origin
      ? containerByNumber.shipment.origin
      : "N/A",
  } = containerByNumber;

  return (
    <div className="flex items-center justify-center min mt-10">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-lg">
        <h3 className="text-lg font-semibold text-center text-blue-900">
          Container Details
        </h3>
        <ul className="list-disc ml-5 text-center">
          <li>
            <strong>Container Number:</strong> {container_number}
          </li>
          <li>
            <strong>Current Type:</strong> {container_type}
          </li>
          <li>
            <strong>Total Shipment Cost:</strong> ${total_cost}
          </li>
          <li>
            <strong>Arrival Port:</strong> {arrival_port}
          </li>
          <li>
            <strong>Origin Port:</strong> {origin}
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ContainerDetails;
