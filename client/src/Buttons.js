import React, { useState } from 'react'
import { useOutletContext } from 'react-router-dom';

function Buttons({ shipment }) {
  const [showInput, setShowInput] = useState(false);
  const [comment, setComment] = useState("");

  const { handleUpdate, handleDelete } = useOutletContext()

  // show input field comment for update functionality.

  const handleUpdateClick = () => {
    setShowInput(!showInput);
  };

  // Call the handleUpdate function with shipment ID and comment
  const handleSave = (id) => {
    if (comment) {
        console.log(comment, id)
      // handle PATCH here, send comment
      handleUpdate(comment, id)

      setShowInput(false); // Optionally hide the input after saving
      setComment(""); // Clear the comment input
    } else {
      alert("Comment is required");
    }
  };

  return (
    <div className="flex space-x-2 mt-2">
      <button
        onClick={handleUpdateClick}
        className="bg-blue-700 text-white py-1 px-3 rounded-lg hover:bg-blue-900"
      >
        {!showInput ? "Update" : "Hide"}
      </button>
      <button
        onClick={() => handleDelete(shipment.id)}
        className="bg-red-700 text-white py-1 px-3 rounded-lg hover:bg-red-900"
      >
        Delete
      </button>

      {/* Show input field when "Update" is clicked */}
      {showInput && (
        <div className="mt-2">
          <input
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Enter your comment"
            className="border rounded-lg py-1 px-3"
          />
          <button
            onClick={() => handleSave(shipment.id)}
            className="bg-green-700 text-white py-1 px-3 rounded-lg hover:bg-green-900 ml-2"
          >
            Save
          </button>
        </div>
      )}
    </div>
  );
}

export default Buttons;