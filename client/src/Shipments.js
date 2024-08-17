import React from "react";
import Shipment from "./Shipment";
// use useOutletContext to access shipment data
import { useOutletContext } from "react-router-dom";

function Shipments() {
  const shipments = useOutletContext();
  console.log(shipments);
  // map through shipments array and render each shipment <Shipment/>
  return (
    <div className="bg-blue-100 border border-blue-300 text-blue-800 p-4 rounded-lg mb-6">
      <h2 className="text-lg font-semibold mb-2">Important Information</h2>
      <p >
        You can only view the list of shipments on this page. To book a new
        shipment, please click on the{" "}
        <a href="/book_shipment" className="text-red-600 hover:underline">
          Book Shipment
        </a>{" "}
        link at the top.
      </p>
      <p>
        Make sure you have enough credit to cover your bookings. You can check
        your credit balance by visiting your{" "}
        <a href="/profile" className="text-red-600 hover:underline">
          Profile
        </a>
        .
      </p>
      <div>
        {shipments.map((shipment) => (
          <div>
            <Shipment shipment={shipment} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Shipments;
