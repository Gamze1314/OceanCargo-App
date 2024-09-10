import React from "react";
import Container from "./Container"; // Import the single Container component

const Containers = ({ containers }) => {

  return (
    <div>
      <h4 className="text-md font-medium text-blue-900 mt-2">Containers:</h4>
      {containers.length > 0 ? (
        containers.map((container) => (
          <Container key={container.id} container={container} />
        ))
      ) : (
        <p>No containers available for this shipment.</p>
      )}
    </div>
  );
};

export default Containers;
