import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { createHashRouter, RouterProvider } from "react-router-dom";

import Root from "./pages/root";
import Index from "./pages/Home";
import NotFound from "./pages/NotFound";
import RoomOptions from "./pages/RoomOptions";
import SubtitleUpload from "./pages/SubtitleUpload";
import RoomInfo from "./pages/RoomInfo.js";
import RoomWatch from "./pages/RoomWatch";

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
        element: <RoomOptions />,
      },
      {
        path: "Room/",
        element: <RoomOptions />,
      },
      {
        path: "subtitleUpload",
        element: <SubtitleUpload />,
      },
      {
        path: "Room/:roomName/RoomInfo",
        element: <RoomInfo />,
      },
      {
        path: "Room/:roomName/watch",
        element: <RoomWatch />,
      },
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<RouterProvider router={router} />);
