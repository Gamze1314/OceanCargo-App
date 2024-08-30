import { Link, useOutletContext } from "react-router-dom";
import NewsSection from "./NewsSection";
//import Buttons
import Buttons from "./Buttons";

// use useOutletContext hook to access shipments, customers.

function Home() {
  // access credit amount
  const { customer, customerShipments , handleUpdate, handleDelete } = useOutletContext();

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
            {customerShipments.length > 0 ? (
              customerShipments.map((shipment) => (
                <div
                  key={shipment.id}
                  className="bg-white shadow-md p-4 mb-2 rounded-lg border border-gray-300"
                >
                  <span className="text-md font-semibold text-gray-700">
                    Status: 
                    {shipment.status}, 
                    Arrival: {shipment.arrival_time},{" "}
                    Route: {shipment.arrival_port} - {shipment.origin}
                  </span>
                  <Buttons 
                  shipment={shipment}
                  handleUpdate={handleUpdate}
                  handleDelete={handleDelete}
                  />
                </div>
              ))
            ) : (
              <p>No upcoming shipments.</p>
            )}
          </div>
          {/* Credit Amount */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h3 className="text-lg font-medium text-blue-900">Credit Amount</h3>
            <p className="bg-gray-200">
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
      {/* News Section */}
      <NewsSection />
    </div>
  );
}

export default Home;
