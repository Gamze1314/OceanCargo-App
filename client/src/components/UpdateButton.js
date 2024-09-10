
function UpdateButton({ onClick }) {
  // update button sends the container id(clicked) thru callback function handleUpdate to Context function. This function will send PATCH request to the backend.
  // container id is passed, with user input.
  // conditionally render input fields if button is clicked. formik with 2 fields.


  // show input field comment for update functionality.
  return (
    <div className="flex space-x-2 mt-2">
      <button
        onClick={onClick}
        className="bg-blue-700 text-white py-1 px-3 rounded-lg hover:bg-red-900"
      >
        Update
      </button>
    </div>
  );
}

export default UpdateButton;
