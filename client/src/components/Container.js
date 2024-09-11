import React, { useContext, useCallback } from "react";
import { Context } from "../context/Context.js"; // Import context
import UpdateButton from "./UpdateButton.js";
import DeleteButton from "./DeleteButton.js";
import EditContainerForm from "./EditContainerForm";

const Container = React.memo(({ container, shipmentId }) => {
  const { selectedContainerId, setSelectedContainerId, setSelectedShipmentId } = useContext(Context);

  // if selectedContainerId does not change, skips re-rendering with React.memo => memoizes the Container component
  // useCallback => caches handleUpdateClick, and handleCancel function , so they do not trigger re-renders.
  // useCallback memoizes the handleUpdateClick and handleCancel functions, so they are only re-created when their dependencies change.

  const handleUpdateClick = useCallback(() => {
    // Only update if the ID is different
    if (selectedContainerId !== container.id) {
      setSelectedContainerId(container.id);
      setSelectedShipmentId(shipmentId); // Also update shipmentId when container is selected for editing.
    }
  }, [selectedContainerId, container.id, setSelectedContainerId,setSelectedShipmentId , shipmentId]);

  const handleCancel = useCallback(() => {
    setSelectedContainerId(null); // Reset selectedContainerId when editing is canceled
    setSelectedShipmentId(null); // Reset selectedShipmentId when editing is cancelled
  }, [setSelectedContainerId, setSelectedShipmentId]);

  // console.log(selectedContainerId);

  // // Only re-render if selectedContainerId or container.id changes
  // const isSelected = selectedContainerId === container.id;

  // console.log(`Container ${container.container_number} render`);

  return (
    <div>
      {selectedContainerId === container.id ? (
        <EditContainerForm container={container} onCancel={handleCancel} />
      ) : (
        <div className="bg-gray-50 p-1 rounded-lg border border-gray-200 mb-2 flex items-center space-x-2 mt-2">
          <h4 className="text-sm text-gray-800">
            Container Number: {container.container_number}
          </h4>
          <p>Type: {container.container_type}</p>
          <p>Price: {container.price}</p>
          <UpdateButton onClick={handleUpdateClick} />
          <DeleteButton container={container} shipmentId={shipmentId} />
        </div>
      )}
    </div>
  );
});

// Set displayName for the memoized component
Container.displayName = 'Container';

export default Container;

// if Update button is clicked, how the form only for specific container.(container.id, shipment.id) ?
// isEditing is a piece of UI state that's specific to each Container component.
// selectedContainerId  needed globally since other parts of the app need to know which container is being edited.
