import React from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";

//  useState for component state, useEffect for side effects.
// yup for form validation
//  form handling => formik.


const NewBookingForm = () => {
  const navigate = useNavigate()

  //  define the validation rules for the form. required fields, length, type.
  const formSchema = yup.object().shape({
    vesselName: yup.string().required("Must enter vessel name"),
    origin: yup.string().required("Must enter the origin port"),
    containerType: yup.string().required("Must enter container type"),
  });

  // formik is a hook used to hold form data and handle validations/form submission.
  const formik = useFormik({
    initialValues: {
      vesselName: "",
      origin: "",
      containerType: "",
    },
    validationSchema: formSchema,
    onSubmit: (values) => {
      // handle POST request and error response here.
      console.log("Form values:", values); // values is an object holds the form data.
    },
  });


// 




  return (
    <div className="flex justify-center items-center min-h">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-semibold text-blue-900 mb-4">
          Please enter required fields to book a shipment with us!
        </h1>
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="vesselName"
              className="block text-sm font-medium text-gray-700"
            >
              Vessel Name:
            </label>
            <input
              id="vesselName"
              name="vesselName"
              type="text"
              placeholder="Please view shipments page for vessel name.."
              onChange={formik.handleChange}
              value={formik.values.vesselName}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
            />
            {formik.errors.vesselName && formik.touched.vesselName ? (
              <p className="text-red-500 text-xs mt-1">
                {formik.errors.vesselName}
              </p>
            ) : null}
          </div>

          <div>
            <label
              htmlFor="origin"
              className="block text-sm font-medium text-gray-700"
            >
              Origin:
            </label>
            <input
              id="origin"
              name="origin"
              type="text"
              placeholder="Enter origin port.Karachi, Guangzong ..etc "
              onChange={formik.handleChange}
              value={formik.values.origin}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
            />
            {formik.errors.origin && formik.touched.origin ? (
              <p className="text-red-500 text-xs mt-1">
                {formik.errors.origin}
              </p>
            ) : null}
          </div>

          <div>
            <label
              htmlFor="containerType"
              className="block text-sm font-medium text-gray-700"
            >
              Container Type:
            </label>
            <input
              id="containerType"
              name="containerType"
              type="text"
              placeholder="40HC, 20SD.."
              onChange={formik.handleChange}
              value={formik.values.containerType}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
            />
            {formik.errors.containerType && formik.touched.containerType ? (
              <p className="text-red-500 text-xs mt-1">
                {formik.errors.containerType}
              </p>
            ) : null}
          </div>
          <button
            type="submit"
            className="w-full bg-gray-700 text-white py-2 px-4 rounded-lg hover:bg-blue-900"
          >
            Submit
          </button>
          <button
            type="button"
            className="flex items-center justify-center w-full bg-gray-700 text-white py-2 px-4 rounded-lg hover:bg-blue-900 mt-2"
            onClick={() => navigate("/shipments")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              className="w-5 h-5 mr-2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Shipments Page
          </button>
        </form>
      </div>
    </div>
  );
}

export default NewBookingForm;
