import { useFormik } from "formik";
import * as yup from "yup";
import React, { useContext } from "react";
import { Context } from "../context/Context.js"; // Import context

// search by container number, display its details
// display a form to get container number and search button (Formik)

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
});

function Search() {
  const { searchContainer } = useContext(Context);


  const formik = useFormik({
    initialValues: {
      container_number: "",
    },
    validationSchema,
    onSubmit: (values) => {
      console.log(values);
      searchContainer(values);
      formik.resetForm(); // Reset the form after submission
    },
  });

  // centers form both vertically and horizantally.

  return (
    <div className="p-4 h-min-screen flex items-center justify-center mt-10">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-lg">
        <h1 className="text-2xl font-semibold text-blue-900 mb-4">
          Search by Container Number
        </h1>
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          {/* Container Number Input and Search Button */}
          <div className="flex items-center space-x-2">
            <input
              type="text"
              id="container_number"
              name="container_number"
              placeholder="MSDU456789..."
              value={formik.values.container_number}
              onChange={formik.handleChange}
              className="p-2 border border-gray-300 rounded w-full"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white p-2 rounded"
            >
              Search
            </button>
          </div>
          {/* Error Message */}
          {formik.touched.container_number &&
            formik.errors.container_number && (
              <div className="text-red-500 text-xs mt-1">
                {formik.errors.container_number}
              </div>
            )}
        </form>
      </div>
    </div>
  );
}

export default Search;
