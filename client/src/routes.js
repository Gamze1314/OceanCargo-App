// import react router functions
import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import ErrorPage from "./ErrorPage";
import Home from "./Home";
import Shipments from "./Shipments";
import Profile from "./UserProfile";
import NewBookingForm from "./NewBookingForm";
import Login from "./Login";
import LogOut from "./LogOut";



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
        path: "/book_shipment",
        element: <NewBookingForm />,
        errorElement: <ErrorPage />,
      },
      {
        path: "/login",
        element: <Login />,
        errorElement: <ErrorPage />,
      },
      {
        path: "/logout",
        element: <LogOut />,
        errorElement: <ErrorPage />,
      },
      //...all other routes => redirect to Error page.
      {
        path: "*",
        element: <ErrorPage />,
        errorElement: <ErrorPage />,
      }
    ],
  },
]);

export default router;
