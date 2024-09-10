import React from "react";
import UpdateButton from "./UpdateButton.js";
import DeleteButton from "./DeleteButton.js";


const Container = ({ container, shipmentId }) => {
  return (
    <div className="bg-gray-50 p-1 rounded-lg border border-gray-200 mb-2 flex items-center space-x-2 mt-2">
      <h4 className="text-sm text-gray-800">
        Container Number: {container.container_number}
      </h4>
      <p>Type: {container.container_type}</p>
      <p>Price: {container.price}</p>
      <UpdateButton 
      container={container}
      />
      <DeleteButton 
      container={container} 
      shipmentId={shipmentId}
      />
    </div>
  );
};

export default Container;
