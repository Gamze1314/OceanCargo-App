// AddContainer button will display for each shipment to add container.
import React, { useContext } from "react";
import { Context } from "../context/Context";

function AddContainerButton({ shipmentId }) {
  const { setSelectedShipmentId, showAddContainerForm , setShowAddContainerForm } = useContext(Context);

  const handleClick = () => {
    setSelectedShipmentId(shipmentId); // selectedShipmentId is updated when the user clicks the button.
    setShowAddContainerForm(!showAddContainerForm); // state is being updated => true
  };

  return (
    <div>
      <button
        onClick={handleClick}
        className="bg-green-700 text-white py-1 px-3 rounded-lg hover:bg-blue-900 "
      >
        Add Container
      </button>
    </div>
  );
}

export default AddContainerButton;
