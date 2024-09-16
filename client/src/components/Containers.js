import Container from "./Container"; // Import the single Container component

const Containers = ({ containers, shipmentId }) => {
  return (
    <div>
      <h4 className="text-md font-semibold text-blue-900 mt-1">
        Containers:
      </h4>
      {containers.length > 0 ? (
        containers.map((container, index) => (
          <Container
            index={index}
            key={container.container_number}
            container={container}
            shipmentId={shipmentId}
          />
        ))
      ) : (
        <p>No containers available for this shipment.</p>
      )}
    </div>
  );
};

export default Containers;
