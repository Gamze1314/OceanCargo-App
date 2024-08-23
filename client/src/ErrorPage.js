import { useRouteError, Link } from "react-router-dom";

function ErrorPage() {
  const error = useRouteError();

  return (
    <div>
      <h1 className="text-red-600 font-bold text-2xl flex justify-center items-center p-8 mt-8">
        {error}
      </h1>
      <Link
        className="text-blue-600 font-bold text-1xl flex justify-center items-center p-8 mt-8"
        to="/login"
      >
        {" "}
        <button className="bg-blue-700 text-white py-1 px-3 rounded-lg hover:bg-red-900 ml-2">
          Click here to login{" "}
        </button>
      </Link>
    </div>
  );
}

export default ErrorPage;
