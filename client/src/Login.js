import { useOutletContext, NavLink } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";

const Login = () => {
  const { logInCustomer } = useOutletContext();

  const validationSchema = Yup.object({
    username: Yup.string()
      .min(5, "Username must be at least 5 characters long")
      .max(10, "Username must be at most 10 characters long")
      .required("Username is required"),
  });
  // Username must be between 5 and 10 characters long and not empty

  // hold form data with useFormik hook
  const formik = useFormik({
    initialValues: {
      username: "",
    },
    validationSchema,
    onSubmit: (values) => {
      // This will log the form's current values
      logInCustomer(values);
    },
  });

  // center form with flexbox and grid
  const formClass = "bg-white p-9 rounded-lg shadow-lg w-full max-w-md";

  return (
    <div className="flex justify-center items-center min-h">
      <main>
        <h1 className="text-blue-800 font-bold text-2xl justify items-center p-8 mt-8">
          Login
        </h1>
        <form className={formClass} onSubmit={formik.handleSubmit}>
          <div>
            <label htmlFor="username">Username: </label>
            <input
              className="bg-gray-70 border border-blue-300 text-blue-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-72 md:w-72 sm:w-32 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-blue-200 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mt-4"
              id="username"
              type="text"
              name="username"
              placeholder="Please enter your username..."
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.username}
            />
          </div>
          <button
            className="bg-gray-50 border border-blue-300 text-blue-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-50 md:w-50 sm:w-32 p-2.5 dark:bg-gray-500 dark:border-gray-600 dark:placeholder-blue-200 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mt-7"
            type="submit"
          >
            Log in
          </button>
        </form>
        {/* if they have not signed up, add link to /signup page */}
        <div>
          <p className="text-md text-blue-600 flex justify-center mt-3">
            New to our online services?
          </p>
          <NavLink to="/signup" className=" text-blue-700 flex justify-center hover:underline">
            Sign up!
          </NavLink> 
        </div>
      </main>
    </div>
  );
};

export default Login;
