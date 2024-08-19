import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";

//  useState for component state, useEffect for side effects.
// yup for form validation
//  form handling => formik.

const NewBookingForm = () => {
  //  useOutletContext for shipments info.
  const shipments = useOutletContext()
  //  state to hold form data

  //  define the validation rules for the form. required fields, length, type.
  const formSchema = yup.object().shape({
    vesselName: yup.string().required("Must enter vessel name"),
    origin: yup.string().required("Must enter the origin port"),
    containerType: yup.string().required("Must enter container type"),
  });


  // formik is a hook used to hold form data and handle validations/form submission.
  // shipments table has these info.
  const formik = useFormik({
    initialValues: {
      vesselName: "",
      origin: "",
      containerType: "",
    },
    validationSchema: formSchema,
    onSubmit: (values) => {
      // handle POST request and error response here.
    },
  });

  return (
    <div>
      <h1>New Booking Form</h1>
      <form onSubmit={formik.handleSubmit} style={{ margin: "30px" }}>
        <label htmlFor="email">Vessel Name:</label>
        <br />
        <input
          id="email"
          name="email"
          onChange={formik.handleChange}
          value={formik.values.email}
        />
        <p style={{ color: "red" }}> {formik.errors.email}</p>
        <label htmlFor="name">Origin</label>
        <br />

        <input
          id="name"
          name="name"
          onChange={formik.handleChange}
          value={formik.values.name}
        />
        <p style={{ color: "red" }}> {formik.errors.name}</p>

        <label htmlFor="age">Container Type:</label>
        <br />

        <input
          id="age"
          name="age"
          onChange={formik.handleChange}
          value={formik.values.age}
        />
        <p style={{ color: "red" }}> {formik.errors.age}</p>
        <button type="submit">Submit</button>
      </form>
      <table style={{ padding: "15px" }}>
        <tbody>
          <tr>
            <th>name</th>
            <th>email</th>
            <th>age</th>
          </tr>
          {"" === "undefined" ? (
            <p>Loading</p>
          ) : (
            shipments.map((shipment, i) => (
              <>
                <tr key={i}>
                  <td>{}</td>
                  <td>{}</td>
                  <td>{}</td>
                </tr>
              </>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default NewBookingForm;
