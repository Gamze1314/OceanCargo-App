// import react router functions
import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import ErrorPage from "./pages/ErrorPage";
import Home from "./pages/Home";
import Shipments from "./pages/Shipments";
import GoogleMap from "./pages/GoogleMap";
import Search from "./pages/Search";


//App will render children components.
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Home />,
        errorElement: <ErrorPage />,
      },
      {
        path: "/shipments",
        element: <Shipments />,
        errorElement: <ErrorPage />,
      },
      {
        path: "/search_container",
        element: <Search />,
        errorElement: <ErrorPage />,
      },
      {
        path: "/map",
        element: <GoogleMap />,
        errorElement: <ErrorPage />,
      },
    ],
  },
  {
    path: "*", // for unmatched paths
    element: <ErrorPage />,
  },
]);

export default router;
