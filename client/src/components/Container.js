import React, { useContext, useCallback, useEffect } from "react";
import { Context } from "../context/Context.js";
import UpdateButton from "./UpdateButton.js";
import DeleteButton from "./DeleteButton.js";
import EditContainerForm from "./EditContainerForm";

const Container = React.memo(({ container, shipmentId, index }) => {
    const {
      selectedContainerId,
      setSelectedContainerId,
      setSelectedShipmentId,
      showAddContainerForm,
      setShowAddContainerForm,
    } = useContext(Context);

  // if selectedContainerId does not change, skips re-rendering with React.memo => memoizes the Container component
  // useCallback => caches handleUpdateClick, and handleCancel function , so they do not trigger re-renders.
  // useCallback memoizes the handleUpdateClick and handleCancel functions, so they are only re-created when their dependencies change.

  const handleUpdateClick = useCallback(() => {
    console.log("Memoized function 1")
    // Only update if the ID is different
    if (selectedContainerId !== container.id) {
      setSelectedContainerId(container.id);
      setSelectedShipmentId(shipmentId); // Also update shipmentId when container is selected for editing.
      setShowAddContainerForm(false); // the add form will be hidden
    }
  }, [selectedContainerId, container.id, setSelectedContainerId, setSelectedShipmentId , shipmentId, setShowAddContainerForm]);



  const handleCancel = useCallback(() => {
    console.log("Memoized function 2");
    setSelectedContainerId(null); // Reset selectedContainerId when editing is canceled
    setSelectedShipmentId(null); // Reset selectedShipmentId when editing is cancelled
  }, [setSelectedContainerId, setSelectedShipmentId]);



  // show edit container form if add container form is not shown, alert user to perform one action at a time for the same shipment.

  useEffect(() => {
    if (selectedContainerId === container.id && !showAddContainerForm) {
      // Only show the alert if the add form is not showing
      alert("Please confirm you want to edit this container.");
    }
  }, [selectedContainerId, showAddContainerForm, container.id]);


  return (
    <div>
      {selectedContainerId === container.id && showAddContainerForm === false ? (
        <EditContainerForm container={container} onCancel={handleCancel} />
      ) : (
        <div className="bg-gray-50 p-1 rounded-lg border border-gray-200 mb-2 flex items-center space-x-2 mt-2">
          <h4 className="text-sm text-gray-800">
            {index + 1}. Container Number: {container.container_number}
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
// isEditing is a piece of UI state that's specific to each Container component.
// selectedContainerId  needed globally since other parts of the app need to know which container is being edited.
