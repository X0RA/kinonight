import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { createHashRouter, RouterProvider } from "react-router-dom";

import Root from "./pages/root";
import NotFound from "./pages/NotFound";
import Index from "./pages/index";
import Room from "./pages/room";
import SubtitleUploadPage from "./pages/SubtitleUploadPage";

import Temp from "./components/temp";

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
      {
        path: "subtitleUpload",
        element: <SubtitleUploadPage />,
      },
      {
        path: "emoji",
        element: <Temp />,
      },
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<RouterProvider router={router} />);
