import { useRouteError } from "react-router-dom";

function ErrorPage() {
  const error = useRouteError();

  return (
    <div>
      <h1 className="text-red-600 font-bold text-2xl flex justify-center items-center p-8 mt-8">
        {error}
      </h1>
    </div>
  );
}

export default ErrorPage;
