import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { createHashRouter, RouterProvider } from "react-router-dom";

import Root from "./pages/root";
import NotFound from "./pages/NotFound";
import Index from "./pages/index";
import Room from "./pages/room";

const router = createHashRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <NotFound />,
    children: [
      {
        path: "/",
        element: <Index />,
      },
      {
        path: "Room/:roomName",
        element: <Room />,
      },
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<RouterProvider router={router} />);
