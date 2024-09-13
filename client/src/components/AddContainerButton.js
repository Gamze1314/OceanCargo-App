// AddContainer button will display for each shipment to add container.
import React, { useContext } from "react";
import { Context } from "../context/Context";

function AddContainerButton({ shipmentId }) {
  const { setSelectedShipmentId, setShowAddContainerForm } =
    useContext(Context);

  const handleClick = () => {
    setSelectedShipmentId(shipmentId); // selectedShipmentId is updated when the user clicks the button.
    setShowAddContainerForm(true); // state is being updated => true
  };

  return (
    <div className="flex justify-end">
      <button
        onClick={handleClick}
        className="bg-blue-700 text-white py-1 px-3 rounded-lg hover:bg-blue-900 "
      >
        Add Container
      </button>
    </div>
  );
}

export default AddContainerButton;
