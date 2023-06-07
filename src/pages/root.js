import { Outlet, Link } from "react-router-dom";
import Navigation from "../components/horizontal";
import React from "react";

import { AuthProvider } from "../middleware/AuthContext";

import { UserStateProvider } from "../middleware/StateContext";

export default function Root() {
  return (
    <>
      <AuthProvider>
        <UserStateProvider>
          {/* <Navigation /> */}
          <Outlet />
        </UserStateProvider>
      </AuthProvider>
    </>
  );
}
