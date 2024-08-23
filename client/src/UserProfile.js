import React from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { useOutletContext } from "react-router-dom";

function UserProfile() {
  const { customer, handleAccountUpdate } = useOutletContext();

  // form schema for validation
  const formSchema = yup.object().shape({
    //username min 5 max 10 charc.

    username: yup.string()
     .min(5, "Username must be at least 5 characters long")
      .max(10, "Username must be at most 10 characters long")
    .required("Username is required"),
    email: yup
      .string()
      .email("Invalid email address")
      .required("Email is required"),
    type: yup
      .string()
      .required("Account type is required")
  });

  const formik = useFormik({
    initialValues: {
      username: "", // string
      email: "", // email format, must include @, and type: string
      type: "", // 2 types only: consignee or forwarder (dropdown)
    },
    validationSchema: formSchema,
    onSubmit: (values) => {
      console.log(values); // log form values to the console
      // handle PATCH request here

      handleAccountUpdate(values)
    },
  });

  return (
  <>
    {customer ? (
      <>
        <h1 className="flex justify-center block text-md font-medium mt-6">
          Please fill out the form below to update your account information.
        </h1>
        <div className="flex justify-center items-center min-h">
          <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
            <form onSubmit={formik.handleSubmit}>
              <label
                className="block text-md font-medium text-gray-700"
                htmlFor="username"
              >
                Username:
              </label>
              <input
                className="mt-3 p-2 block w-full border border-gray-300 rounded-md"
                id="username"
                name="username"
                placeholder={customer.username}
                onChange={formik.handleChange}
                value={formik.values.username}
              ></input>
              {formik.errors.username && formik.touched.username ? (
                <p className="text-red-500 text-xs mt-1">
                  {formik.errors.username}
                </p>
              ) : null}
              
              <label
                className="block text-sm font-medium text-gray-700 mt-3"
                htmlFor="email"
              >
                Email:
              </label>
              <input
                className="mt-3 p-2 block w-full border border-gray-300 rounded-md"
                id="email"
                name="email"
                placeholder={customer.email}
                onChange={formik.handleChange}
                value={formik.values.email}
              ></input>
              {formik.errors.email && formik.touched.email ? (
                <p className="text-red-500 text-xs mt-1">
                  {formik.errors.email}
                </p>
              ) : null}
              
              <label
                htmlFor="type"
                className="block text-sm font-medium text-gray-700 mt-3"
              >
                Account Type:
              </label>
              <select
                className="mt-3 p-2 block w-full border border-gray-300 rounded-md"
                id="type"
                name="type"
                onChange={formik.handleChange}
                value={formik.values.type}
              >
                <option value="">Please select your account type</option>
                <option value="forwarder">Forwarder</option>
                <option value="consignee">Consignee</option>
              </select>
              {formik.errors.type && formik.touched.type ? (
                <p className="text-red-500 text-xs mt-1">
                  {formik.errors.type}
                </p>
              ) : null}
              
              <button
                className="mt-5 w-full bg-gray-700 text-white py-2 px-4 rounded-lg hover:bg-blue-900"
                type="submit"
              >
                Update
              </button>
            </form>
          </div>
        </div>
      </>
    ) : (
      <p className="text-center text-gray-700 mt-8">
        You need to be logged in to view your account information.
      </p>
    )}
  </>
);

}


export default UserProfile