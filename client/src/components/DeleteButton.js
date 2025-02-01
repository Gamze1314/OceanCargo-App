import React, { useContext } from "react";
import { Context } from "../context/Context";

function DeleteButton({ container, shipmentId }) {
  const { deleteContainer } = useContext(Context);

  function handleDelete() {
    deleteContainer(container.id, shipmentId);
  }

  return (
    <div className="flex space-x-2 mt-2">
      <button
        onClick={handleDelete}
        className="bg-red-700 text-white py-1 px-3 rounded-lg hover:bg-yellow-600"
      >
        Delete
      </button>
    </div>
  );
}

export default DeleteButton;
