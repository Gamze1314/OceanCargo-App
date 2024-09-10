// formik to handle new container adding for a specific shipment.
// form values: container number, type, selectedShipmentId


// validates user inputs for cont number : 4 letters and 6 digits
// cont type: 20sd , 40sd , 20hc...  dropdown 
// price: integer 
// must enter all fields, and string(10) for number, and string for cont number.

// formik state to hold cont data and send it to backend.
import React, { useContext } from 'react';
import { Context } from '../context/Context.js'; // Import context
import { useFormik } from "formik";
import * as yup from "yup";



// Define validation schema
const validationSchema = yup.object({
  container_number: yup
    .string()
    .matches(/^[A-Z]{4}\d{6}$/, 'Container number must be 4 letters followed by 6 digits')
    .required('Container number is required'),
  container_type: yup
    .string()
    .oneOf(['20SD', '40SD', '40HC', '20HC', '40HC'], 'Invalid container type')
    .required('Container type is required')
});

function AddContainerForm() {
  const { selectedShipmentId, setSelectedShipmentId, addContainer, setShowAddContainerForm } =
    useContext(Context);

  const formik = useFormik({
    initialValues: {
      container_number: "",
      container_type: "20SD" // default value
    },
    validationSchema,
    onSubmit: (values) => {
      // Add shipmentId to form values
      const containerData = { ...values, shipment_id: selectedShipmentId };
      console.log(containerData);
      addContainer(containerData);
      // Optionally clear form and hide the form after submission
      formik.resetForm();
      setShowAddContainerForm(false);
    },
  });


  function handleCancelClick() {
    setShowAddContainerForm(false);
    setSelectedShipmentId(null)
  }




  return (
    <div className="flex justify-center items-center min-h">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h1 className="text-2md font-semibold text-blue-900 mb-4">
          Please enter required fields to add container for this shipment.
        </h1>
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="container_number"
              className="block text-sm font-medium text-gray-700"
            >
              Container Number
            </label>
            <input
              id="container_number"
              name="container_number"
              type="text"
              placeholder="Enter container number MSDU678904.."
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.container_number}
              className="border rounded-lg py-1 px-3 w-full"
            />
            {formik.touched.container_number &&
            formik.errors.container_number ? (
              <div className="text-red-500 text-sm">
                {formik.errors.container_number}
              </div>
            ) : null}
          </div>

          <div>
            <label
              htmlFor="container_type"
              className="block text-sm font-medium text-gray-700"
            >
              Container Type
            </label>
            <select
              id="container_type"
              name="container_type"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.container_type}
              className="border rounded-lg py-1 px-3 w-full"
            >
              <option value="20SD">20SD</option>
              <option value="20HC">20HC</option>
              <option value="40SD">40SD</option>
              <option value="40HC">40HC</option>
              <option value="40OT">40OT</option>
            </select>
            {formik.touched.container_type && formik.errors.container_type ? (
              <div className="text-red-500 text-sm">
                {formik.errors.container_type}
              </div>
            ) : null}
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="submit"
              className="bg-blue-700 text-white py-1 px-3 rounded-lg hover:bg-blue-900"
            >
              Add Container
            </button>
            <button
              type="button"
              onClick={handleCancelClick}
              //   if cancel button clicked, hide the form, for selected shipment only.
              className="bg-gray-500 text-white py-1 px-3 rounded-lg hover:bg-gray-700"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddContainerForm;