import React, { useContext, useEffect } from "react";
import { Context } from "../context/Context.js"; // Import context
import { useFormik } from "formik";
import * as yup from "yup";

const validationSchema = yup.object({
  container_number: yup
    .string()
    .transform((value) => value.toUpperCase())
    .matches(
      /^[A-Z]{4}\d{6}$/,
      "Container number must be 4 letters followed by 6 digits"
    )
    .max(10)
    .required("Container number is required"),
  container_type: yup
    .string()
    .transform((value) => value.toUpperCase()) // Convert to uppercase before validation
    .oneOf(["20SD", "40SD", "40HC", "20HC", "40HC"], "Invalid container type")
    .required("Container type is required"),
});

const EditContainerForm = ({ onCancel, container }) => {
  const { selectedShipmentId, updateContainer, showAddContainerForm } =
    useContext(Context);

  // useFormik hook returns all Formik state and helpers(manages form state)

  const formik = useFormik({
    initialValues: {
      container_number: container.container_number,
      container_type: container.container_type, // initial container values.
    },
    validationSchema,
    onSubmit: (values) => {
      // Add shipmentId to form values
      const containerData = {
        id: container.id,
        ...values,
        shipment_id: selectedShipmentId,
      };
      updateContainer(containerData); // send container data to update function in Context.(callback)
      onCancel();
      // reset all inputs
      formik.resetForm();
    },
  });

  //cleanup function to remove editform if the edit form component is unmounted, add container form selected.

  useEffect(() => {
    return () => {
      // Check if the add container form was being displayed
      if (showAddContainerForm) {
        // Call the onCancel function to handle the cleanup logic
        onCancel();
      }
      // Reset the form state using Formik's resetForm method
      formik.resetForm();
    };
  }, [showAddContainerForm]); // Dependency ensures cleanup when showAddContainerForm changes

  

  return (
    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4 flex flex-col space-y-2">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h1 className="text-2md font-semibold text-blue-900 mb-4">
          You have selected the container below for editing. Click 'Cancel' to
          exit.
        </h1>
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          {/* Container Number Input */}
          <div className="flex flex-col">
            <label htmlFor="container_number" className="text-gray-700">
              Container Number
            </label>
            <input
              type="text"
              id="container_number"
              name="container_number"
              value={formik.values.container_number}
              onChange={formik.handleChange}
              className="p-1 border border-gray-300 rounded"
            />
            {formik.touched.container_number &&
              formik.errors.container_number && (
                <div className="text-red-500 text-xs">
                  {formik.errors.container_number}
                </div>
              )}
          </div>

          {/* Container Type Input */}
          <div className="flex flex-col">
            <label htmlFor="container_type" className="text-gray-700">
              Container Type
            </label>
            <select
              id="container_type"
              name="container_type"
              value={formik.values.container_type}
              onChange={formik.handleChange}
              className="border rounded-lg py-1 px-3 w-full"
            >
              <option value="">{container.container_type}</option>
              <option value="20SD">20SD</option>
              <option value="20HC">20HC</option>
              <option value="40SD">40SD</option>
              <option value="40HC">40HC</option>
              <option value="40OT">40OT</option>
            </select>
            {formik.touched.container_type && formik.errors.container_type && (
              <div className="text-red-500 text-xs">
                {formik.errors.container_type}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2 mt-2">
            <button
              type="submit"
              className="bg-blue-500 text-white p-1 rounded"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="bg-gray-500 text-white p-1 rounded"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditContainerForm;
