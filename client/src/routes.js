// import react router functions
import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import ErrorPage from "./pages/ErrorPage";
import Home from "./pages/Home";
import Shipments from "./pages/Shipments";
import Profile from "./UserProfile";
import GoogleMap from "./pages/GoogleMap";
import NewBookingForm from "./pages/NewBookingForm";


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
        path: "/profile",
        element: <Profile />,
        errorElement: <ErrorPage />,
      },
      {
        path: "/add_shipment",
        element: <NewBookingForm />,
        errorElement: <ErrorPage />,
      },
      //...all other routes => redirect to Error page.
      {
        path: "/map",
        element: <GoogleMap />,
        errorElement: <ErrorPage />,
      },
      {
        path: "*",
        element: <ErrorPage />,
        errorElement: <ErrorPage />,
      }
    ],
  },
]);

export default router;
