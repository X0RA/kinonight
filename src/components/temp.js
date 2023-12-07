import React, { useState, useRef } from "react";

import NewControls from "./newControls";

const Temp = () => {
  return (
    <div className="w-full h-screen  lg:pl-0 lg:justify-center pt-5 bg-primary-600">
      <NewControls></NewControls>
    </div>
  );
};

export default Temp;
