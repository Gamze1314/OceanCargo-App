// index.js is the root file
import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import router from "./routes";
import "./index.css";
import { MyProvider } from "./context/Context.js";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <MyProvider>
      <RouterProvider router={router} />
    </MyProvider>
);