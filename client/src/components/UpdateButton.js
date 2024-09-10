

function UpdateButton() {


  // show input field comment for update functionality.
  return (
    <div className="flex space-x-2 mt-2">
      <button
        onClick={() => console.log("clicked")}
        className="bg-blue-700 text-white py-1 px-3 rounded-lg hover:bg-red-900"
      >
        Update
      </button>
    </div>
  );
}

export default UpdateButton;
