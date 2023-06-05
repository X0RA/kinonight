import { Outlet, Link } from "react-router-dom";
import Navigation from "../components/horizontal";
import React from "react";

import { AuthProvider } from "../middleware/AuthContext";

export default function Root() {
  return (
    <>
      <AuthProvider>
        {/* <Navigation /> */}
        <Outlet />
      </AuthProvider>
    </>
  );
}
