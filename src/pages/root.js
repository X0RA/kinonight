import { Outlet } from "react-router-dom";
import React from "react";

import { AuthProvider } from "../middleware/AuthContext";
import { UserStateProvider } from "../middleware/StateContext";

export default function Root() {
  return (
    <>
      <AuthProvider>
        <UserStateProvider>
          <Outlet />
        </UserStateProvider>
      </AuthProvider>
    </>
  );
}
