import { useNavigation, useOutletContext} from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";


function Signup() {

    const { handleSignup } = useOutletContext()
    const navigate = useNavigation()

    const validationSchema = Yup.object({
        username: Yup.string()
          .min(5, "Username must be at least 5 characters long")
          .max(10, "Username must be at most 10 characters long")
          .required("Username is required"),
        email: Yup.string()
        // email must contain '@'; validation.
          .email("Invalid email address")
          .required("Email is required"),
        type: Yup.string()
           .required("Account type is required"),
           // credit amount validate=> credit_amount >= 20000.0'
        credit_amount: Yup.number()
           .required("Credit amount is required")
           .min(20000, "Credit amount must be at least $20,000")
      });


    //username, email, credit amount, type => body
    //POST request to => /customers

    const formik = useFormik({
        initialValues: {
          username: "",
          email: "",
          type: "",
          credit_amount: 0
        },
        validationSchema,
        onSubmit: (values) => {
            console.log(values)
            handleSignup(values);

        },
      });




return (
  <div className="flex justify-center items-center min-h">
    <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
      <h1 className="text-2xl font-semibold text-blue-900 mb-4">
        Welcome to Ocean Cargo App! Please sign up to use our services.
      </h1>
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="username"
            className="block text-sm font-medium text-gray-700"
          >
            Please enter your username:
          </label>
          <input
            id="username"
            name="username"
            type="text"
            placeholder="Please enter your username..."
            onChange={formik.handleChange}
            value={formik.values.username}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
          {formik.errors.username && formik.touched.username ? (
            <p className="text-red-500 text-xs mt-1">
              {formik.errors.username}
            </p>
          ) : null}
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mt-3"
          >
            Please enter your email:
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="Please enter your email..."
            onChange={formik.handleChange}
            value={formik.values.email}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
          {formik.errors.email && formik.touched.email ? (
            <p className="text-red-500 text-xs mt-1">{formik.errors.email}</p>
          ) : null}
        </div>

        <div>
          <label
            htmlFor="credit_amount"
            className="block text-sm font-medium text-gray-700 mt-3"
          >
            Please enter your credit amount:
          </label>
          <input
            id="credit_amount"
            name="credit_amount"
            type="number"
            placeholder="Please enter your credit amount..."
            onChange={formik.handleChange}
            value={formik.values.credit_amount}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
          {formik.errors.credit_amount && formik.touched.credit_amount ? (
            <p className="text-red-500 text-xs mt-1">
              {formik.errors.credit_amount}
            </p>
          ) : null}
        </div>

        <div>
          <label
            htmlFor="type"
            className="block text-sm font-medium text-gray-700 mt-3"
          >
            Select type:
          </label>
          <select
            id="type"
            name="type"
            onChange={formik.handleChange}
            value={formik.values.type}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="">Select type</option>
            <option value="consignee">Consignee</option>
            <option value="forwarder">Forwarder</option>
          </select>
          {formik.errors.type && formik.touched.type ? (
            <p className="text-red-500 text-xs mt-1">{formik.errors.type}</p>
          ) : null}
        </div>

        <button
          type="submit"
          className="mt-4 w-full bg-blue-900 text-white py-2 rounded-md"
        >
          Sign Up
        </button>
        <button
          type="button"
          className="mt-4 w-full bg-blue-700 text-white py-2 rounded-md"
          onClick={() => navigate("/login")}
        >
          Already have an account? Login
        </button>
      </form>
    </div>
  </div>
);

}

export default Signup;
