import React from 'react'
import { Link, useOutletContext } from 'react-router-dom'

// use useOutletContext hook to access shipments, customers.

function Home() {
  // access credit amount
  const { customer, customerShipments } = useOutletContext()

  // in the dashbard show remaning credit amount, and customer's shipments.


  return (
    <div className="flex flex-col items-center pt-4 pb-4">
      <div className="bg-white shadow-lg rounded-lg p-11 w max-w-md">
        <h2 className="text-xl font-semibold text-blue-900 mb-4">
          Your Dashboard
        </h2>
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h3 className="text-lg font-medium text-blue-900">
              Upcoming Shipments
            </h3>
            {/* // add the logic to shows shipments if  customer has shipments in db*/}
            {customerShipments.length > 0 ? (
              customerShipments.map((shipment) => (
                <div key={shipment.id}>
                  <p>
                    Departure: {shipment.departure_time}, Arrival:{" "}
                    {shipment.arrival_time}
                  </p>
                </div>
              ))
            ) : (
              <p>No upcoming shipments.</p>
            )}
          </div>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h3 className="text-lg font-medium text-blue-900">
              Remaining Credit Amount
            </h3>
            <p>
              {customer
                ? `$${customer.credit_amount}`
                : "No available credit amount."}
            </p>
          </div>
          <div className="flex justify-between space-x-4">
            <Link
              to="/book_shipment"
              className="bg-gray-700 text-white py-2 px-4 rounded-lg hover:bg-blue-900"
            >
              Book a Shipment
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
    </div>
  );
}

export default Home