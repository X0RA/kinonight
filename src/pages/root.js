import { Outlet, Link } from "react-router-dom";
import Navigation from "../components/horizontal";
import React from "react";

export default function Root() {
  return (
    <>
      {/* <Navigation /> */}
      <div className="">
        <Outlet />
      </div>
    </>
  );
}
