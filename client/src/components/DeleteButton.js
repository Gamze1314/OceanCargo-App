// handles click event, and updates state for deletion of a selected shipment's container.

import React, { useContext } from 'react';
import { Context } from '../context/Context'; // Import the context

function DeleteButton({ container, shipmentId }) {
  const { deleteContainer } = useContext(Context); // use delete function from context.js

  function handleDelete() {
    deleteContainer(container.id, shipmentId); // delete handler to be passed container id
  }

  return (
    <div className="flex space-x-2 mt-2">
      <button
        onClick={handleDelete}
        className="bg-red-700 text-white py-1 px-3 rounded-lg hover:bg-red-900"
      >
        Delete
      </button>
    </div>
  );
}

export default DeleteButton;
