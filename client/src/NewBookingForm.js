import { useFormik } from "formik";
import * as yup from "yup";
import { useNavigate, useOutletContext } from "react-router-dom";
//  import origins and arrivals from portcoordinates
import { origins, arrivals } from './data/portCoordinates.js'


const NewBookingForm = () => {
  const navigate = useNavigate();

  const { bookShipment } = useOutletContext();
  // shipments state to access, vessel_name, origin
  // container types: 40SD, 40HC, 20SD for options
  // comment ; string, input field.

  //  define the validation rules for the form. required fields, length, type.
  const formSchema = yup.object().shape({
    origin: yup.string().required("Must select an origin port."),
    arrival: yup.string().required("Must select an arrival port"),
    container_type: yup.string().required("Must select a container type."),
    // Comment must be between 1 and 50 characters long and not empty
    comment: yup.string().required("Comment field must be between 1 and 50 characters.").max(50).min(1),
  });

  // formik is a hook used to hold form data and handle validations/form submission.
  const formik = useFormik({
    initialValues: {
      origin: "",
      arrival: "",
      container_type: "",
      comment: "",
    },
    validationSchema: formSchema,
      onSubmit: (values) => {
        console.log("Enter in submit function", values);
        bookShipment(values)
      }
  });

  return (
    <div className="flex justify-center items-center min-h">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-semibold text-blue-900 mb-4">
          Please enter required fields to book a shipment with us!
        </h1>
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          {/* vessel name dropdown */}
          {/* <div>
            <label
              htmlFor="vessel_name"
              className="block text-sm font-medium text-gray-700"
            >
              Vessel Name:
            </label>
            <select
              id="vessel_name"
              name="vessel_name"
              onChange={formik.handleChange}
              value={formik.values.vessel_name}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
            >
              <option value="" label="Select vessel name" />
              {shipments.map((shipment) => (
                <option key={shipment.id} value={shipment.vessel_name}>
                  {shipment.vessel_name}
                </option>
              ))}
            </select>
            {formik.errors.vessel_name && formik.touched.vessel_name ? (
              <p className="text-red-500 text-xs mt-1">
                {formik.errors.vessel_name}
              </p>
            ) : null}
          </div> */}
          {/* Origin dropdown */}
          <div>
            <label
              htmlFor="origin"
              className="block text-sm font-medium text-gray-700"
            >
              Departure Port:
            </label>
            <select
              id="origin"
              name="origin"
              onChange={(e) => {
                console.log(e.target.name, e.target.value); // Log field name and value
                formik.handleChange(e);
              }}
              value={formik.values.origin}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
            >
              <option value="" label="Select origin port" />
              {/* origin ports in portCoordinates */}
              {origins.map((origin) => (
                <option key={origin} value={origin}>
                  {origin}
                </option>
              ))}
            </select>
            {formik.errors.origin && formik.touched.origin ? (
              <p className="text-red-500 text-xs mt-1">
                {formik.errors.origin}
              </p>
            ) : null}
          </div>
          {/* arrival dropdown  */}
          <div>
            <label
              htmlFor="arrival"
              className="block text-sm font-medium text-gray-700"
            >
              Arrival Port:
            </label>
            <select
              id="arrival"
              name="arrival"
              onChange={(e) => {
                console.log(e.target.name, e.target.value); // Log field name and value
                formik.handleChange(e);
              }}
              value={formik.values.arrival}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
            >
              <option value="" label="Select arrival port" />
              {/* origin ports in portCoordinates */}
              {arrivals.map((port) => (
                <option key={port} value={port}>
                  {port}
                </option>
              ))}
            </select>
            {formik.errors.arrival && formik.touched.arrival ? (
              <p className="text-red-500 text-xs mt-1">
                {formik.errors.arrival}
              </p>
            ) : null}
          </div>
          {/* container type dropdown */}
          <div>
            <label
              htmlFor="containerType"
              className="block text-sm font-medium text-gray-700"
            >
              Container Type:
            </label>
            <select
              id="container_type"
              name="container_type"
              onChange={(e) => {
                console.log(e.target.name, e.target.value); // Log field name and value
                formik.handleChange(e);
              }}
              value={formik.values.container_type}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
            >
              <option value="" label="Select container type" />
              {/* cont types: 40SD, 20SD, 40HC */}
              <option value="40SD">40SD</option>
              <option value="20SD">20SD</option>
              <option value="40HC">40HC</option>
            </select>
            {formik.errors.container_type && formik.touched.container_type ? (
              <p className="text-red-500 text-xs mt-1">
                {formik.errors.container_type}
              </p>
            ) : null}
          </div>

          {/* Comment Input Field */}
          <div>
            <label
              htmlFor="comment"
              className="block text-sm font-medium text-gray-700"
            >
              Comment:
            </label>
            <input
              id="comment"
              name="comment"
              type="text"
              placeholder="Please enter your comment..."
              onChange={formik.handleChange}
              value={formik.values.comment}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
            />
            {formik.errors.comment && formik.touched.comment ? (
              <p className="text-red-500 text-xs mt-1">
                {formik.errors.comment}
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
        <p className="text-red-500 text-xs mt-1">
          * Each shipment starts from a different origin and is carried by a
          different vessel.
        </p>
        <p className="text-red-500 text-xs mt-1">
          * Each container type can be booked for any route.
        </p>
      </div>
    </div>
  );
};

export default NewBookingForm;
