// display searched container details here

const ContainerDetails = ({ container, shipment }) => {
  // console.log(shipment) => containerobject
  // console.log(container) => shipment object

  return (
    <div className="flex items-center justify-center min mt-10">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-lg">
        <h3 className="text-lg font-semibold text-center text-blue-900">
          Container Details
        </h3>
        <ul className="list-disc ml-5 text-center">
          <li>
            <strong>Container Number:</strong> {container.container_number}
          </li>
          <li>
            <strong>Current Type:</strong> {container.container_type}
          </li>
          <li>
            <strong>Total Shipment Cost:</strong> ${container.total_cost}
          </li>
          <li>
            <strong>Arrival Port:</strong> {shipment.arrival_port}
          </li>
          <li>
            <strong>Origin Port:</strong> {shipment.origin}
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ContainerDetails;
