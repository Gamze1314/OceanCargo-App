import React from "react";
import Shipment from "./Shipment";
// use useOutletContext to access shipment data
import { useOutletContext } from "react-router-dom";

function Shipments() {
  const { shipments, customer } = useOutletContext();
  console.log(shipments, customer);
  // map through shipments array and render each shipment <Shipment/>
  // check if user logged in , else returns a message.

  if (!customer) {
    return (
      <div className="bg-blue-100 border border-blue-300 text-blue-800 p-4 rounded-lg mb-6">
        <h2 className="text-lg font-semibold mb-2">Access Denied</h2>
        <p>You need to be logged in to view shipments.</p>
      </div>
    );
  }

  return (
    <div className="bg-blue-100 border border-blue-300 text-blue-800 p-4 rounded-lg mb-6">
      <h2 className="text-lg font-semibold mb-2">Important Information</h2>
      <p>
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
