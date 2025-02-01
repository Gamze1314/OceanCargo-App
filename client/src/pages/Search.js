import { useFormik } from "formik";
import * as yup from "yup";
import React, { useContext, useEffect } from "react";
import { Context } from "../context/Context.js";
import ContainerDetails from "../components/ContainerDetails.js";


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
  const { searchContainer, containerByNumber , setContainerByNumber } = useContext(Context);

  const formik = useFormik({
    initialValues: {
      container_number: "",
    },
    validationSchema,
    onSubmit: (values) => {
      searchContainer(values);
      formik.resetForm();
    },
  });

  useEffect(() => {
    return () => {
      setContainerByNumber(null);
    };
  }, [setContainerByNumber]);


  return (
    <div className="p-4 h-min-screen flex flex-col items-center justify-center mt-10">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-lg">
        <h1 className="text-2xl font-semibold text-blue-900 mb-4">
          Search by Container Number
        </h1>
        <form onSubmit={formik.handleSubmit} className="space-y-4">
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
          {formik.touched.container_number &&
            formik.errors.container_number && (
              <div className="text-red-500 text-xs mt-1">
                {formik.errors.container_number}
              </div>
            )}
        </form>
      </div>
      {containerByNumber && containerByNumber.container ? (
        <ContainerDetails
          container={containerByNumber.container}
          shipment={containerByNumber.shipment}
        />
      ) : (
        <p>No container details to show.</p>
      )}
    </div>
  );
}

export default Search;
