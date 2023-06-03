import React, { useState, useEffect } from "react";

const ProgressBar = () => {
  const [progbar, setProgbar] = useState(0);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    const hours = Math.floor(minutes / 60);
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;
    const formattedHours = hours < 10 ? `0${hours}` : hours;
    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  };

  return (
    <div className="w-full bg-gray-200 rounded-full dark:bg-gray-700">
      <div
        id="progress-bar"
        className="bg-primary-200 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full"
        style={{ width: `${23}%` }}>
        <span>10:00:01 / 10:00:01</span>
      </div>
    </div>
  );
};

export default ProgressBar;
