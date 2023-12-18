import React, { useState, useEffect } from "react";

// icons
// icons
import { Play, Pause, PlayForward, PlayBack } from "@styled-icons/ionicons-solid";
import { Trash, Lock, Unlock } from "@styled-icons/fa-solid";
import { Exit } from "@styled-icons/ionicons-solid";
import { EmojiAdd } from "@styled-icons/fluentui-system-filled";
import { SidebarCollapse } from "@styled-icons/octicons";
import { FullScreenMaximize } from "@styled-icons/fluentui-system-regular";
import { Subtitles } from "@styled-icons/material-rounded/Subtitles";
import { VolumeMute, VolumeDown, VolumeUp, ArrowIosBack, ArrowIosForward } from "@styled-icons/evaicons-solid";

const MobileControls = ({ playerRef, setSidebar, sidebar, progress, logOut, clearVideo, formatTime }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isVisible, setIsVisible] = useState(false); // new state variable
  const transformStyle = sidebar ? "w-full" : "w-full";
  const controlStyle = isVisible ? "opacity-100 pointer-events-auto" : "opacity-0";
  const buttonUsability = isVisible ? "pointer-events-auto" : "pointer-events-none";

  const toggleVisibility = (event) => {
    event.stopPropagation();
    setIsVisible(!isVisible);
  };

  const handleButtonClick = (event) => {
    event.stopPropagation();
    // handle button click
  };

  return (
    <div
      onClick={toggleVisibility}
      className={`fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center transition-transform duration-300  transition-opacity duration-300 ${transformStyle} ${controlStyle}`}>
      {/* top left */}
      <div className="left-5 top-5 fixed">
        <div>
          <button
            className={`text-white hover:text-gray-300 focus:outline-none ${buttonUsability}`}
            aria-label="Play Previous">
            <Exit size="38" />
          </button>
        </div>
      </div>
      {/* top right */}
      <div className="right-5 top-5 fixed rounded-lg bg-slate-800 bg-opacity-80 p-2 w-15">
        <input
          id="small-range"
          type="range"
          value={10}
          onChange={(event) => {
            //   changeVolume(event.target.value);
          }}
          className="mr-2 accent-primary-500 h-2 rounded appearance-none cursor-pointer range-sm dark:bg-slate-500 rounded-lg slider-track-custom"
        />
        <VolumeUp onClick={() => {}} color="slate-800" className="dark:text-slate-300 w-5" />
      </div>
      {/* middle */}
      <div className="flex space-x-10">
        <button
          className={`text-white hover:text-gray-300 focus:outline-none ${buttonUsability}`}
          aria-label="Play Previous">
          <PlayBack size="48" />
        </button>
        <button
          className={`text-white hover:text-gray-300 focus:outline-none ${buttonUsability}`}
          onClick={() => setIsPlaying(!isPlaying)}
          aria-label={isPlaying ? "Pause" : "Play"}>
          {isPlaying ? <Pause size="48" /> : <Play size="48" />}
        </button>
        <button
          className={`text-white hover:text-gray-300 focus:outline-none ${buttonUsability}`}
          aria-label="Play Next">
          <PlayForward size="48" />
        </button>
      </div>
      {/* middle far right */}
      <div className="right-5 absolute">
        <button
          className={`text-white hover:text-gray-300 focus:outline-none ${buttonUsability}`}
          aria-label="Show Sidebar"
          onClick={() => {
            setSidebar(!sidebar);
          }}>
          <ArrowIosBack size="38" />
        </button>
      </div>
      {/* bottom middle */}
      <div className="absolute bottom-0 w-full ">
        <div className=" inset-x-0 bottom-0  justify-center pb-2 pl-4 pr-4">
          <div className="flex items-center h-3 w-full max-w-screen-lg mx-auto px-0 bg-slate-400 rounded dark:bg-slate-800 overflow-visible">
            <div
              id="progress-bar"
              className="h-full  bg-slate-200 rounded dark:bg-slate-500"
              style={{ width: `${25}%` }}></div>
          </div>
        </div>
        {/* time under progress bar */}
        <div className="flex justify-between px-4 text-white text-xs pl-4 pr-4 pb-2">
          <div>00:00</div>
          <div>00:00</div>
        </div>
      </div>
      {/* end */}
    </div>
  );
};

export default MobileControls;
