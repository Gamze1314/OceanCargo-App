import Shipment from "../components/Shipment.js";
import React, { useContext } from "react";
import { Context } from "../context/Context.js";


function Shipments() {
  const { shipments } = useContext(Context);

  // map through shipments array and render each shipment component <Shipment/>

  return (
    <div className="bg-blue-100 border border-blue-300 text-blue-800 p-4 rounded-lg mb-6">
      <h2 className="text-lg font-semibold mb-2">Important Information</h2>
      <p>
        You can only view the list of shipments on this page. To edit your shipments, please click on the{" "}
        <a href="/" className="text-red-600 hover:underline">
          Home
        </a>{" "}
        link at the top corner.
      </p>
      <div>
        {shipments.length > 0 ? (
          shipments.map((shipment) => (
            <Shipment key={shipment.id} shipment={shipment} />
          ))
        ) : (
          <p>No shipments available.</p>
        )}
      </div>
    </div>
  );
}

export default Shipments;
