import React, { useState } from "react";
import { GoSignOut } from "react-icons/go";
import {
  BsPlay,
  BsPause,
  BsTrash3,
  BsSkipBackward,
  BsSkipForward,
  BsVolumeDown,
  BsArrowsFullscreen,
} from "react-icons/bs";

const PlayerControls = ({ playerRef, progress, logOut, formatTime, clearVideo }) => {
  const [isVolumeBarVisible, setVolumeBarVisible] = useState(false);
  const [volume, setVolume] = useState(50);
  const toggleVolumeBar = () => {
    setVolumeBarVisible(!isVolumeBarVisible);
  };
  const changeVolume = (event) => {
    const newVolume = event.target.value;
    setVolume(newVolume);
    if (playerRef.current) {
      playerRef.current.volume = newVolume / 100;
    }
  };

  const requestFullscreen = () => {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    } else if (document.documentElement.mozRequestFullScreen) {
      document.documentElement.mozRequestFullScreen();
    } else if (document.documentElement.webkitRequestFullscreen) {
      document.documentElement.webkitRequestFullscreen();
    } else if (document.documentElement.msRequestFullscreen) {
      document.documentElement.msRequestFullscreen();
    }
  };

  const handleProgressBarClick = (event) => {
    const progressBar = event.currentTarget;
    const progressBarRect = progressBar.getBoundingClientRect();
    const clickPosition = event.clientX - progressBarRect.left;
    const progressBarWidth = progressBarRect.width;
    const seekPercentage = (clickPosition / progressBarWidth) * 100;
    const seekTime = (seekPercentage / 100) * progress.duration;

    if (playerRef.current) {
      playerRef.current.currentTime(seekTime);
    }
  };
  return (
    <>
      <div className="bg-slate-600 w-full dark:bg-slate-900">
        {/* Track and volume bar */}
        <div className="flex space-x-4 items-center h-6 w-full border border-slate-700 dark:border-slate-500 pl-5 pr-5">
          <div
            className="w-5/6 flex items-center bg-slate-400 rounded dark:bg-slate-800 overflow-visible"
            onClick={handleProgressBarClick}>
            <div
              id="progress-bar"
              className="bg-slate-200 text-xs font-medium text-slate-100 text-center p-1 leading-none rounded dark:bg-slate-500"
              style={{ width: `${progress.percentage}%` }}></div>
          </div>
          {/* volume bar */}
          <input
            id="small-range"
            type="range"
            value={volume}
            onChange={changeVolume}
            className="w-1/6 h-2  rounded appearance-none cursor-pointer range-sm bg-slate-400 dark:bg-slate-800 rounded-lg "
          />
        </div>
        {/* Bottom buttons */}
        <div className="flex space-x-0 justify-start h-12 w-full">
          <button
            className="flex items-center justify-center w-12 h-12 bg-slate-600 border-b border-l border-slate-700 hover:bg-slate-700 dark:bg-slate-900 dark:border-slate-500 dark:hover:bg-slate-800"
            onClick={logOut}>
            <GoSignOut color="slate-800" className="dark:text-slate-300" />
          </button>
          <button
            onClick={() => playerRef.current && playerRef.current.play()}
            className="flex items-center justify-center w-12 h-12 bg-slate-600 border-l border-b border-r border-slate-700 hover:bg-slate-700 dark:bg-slate-900 dark:border-slate-500 dark:hover:bg-slate-800">
            <BsPlay color="slate-800" className="dark:text-slate-300" />
          </button>
          <button
            className="flex items-center justify-center w-12 h-12 bg-slate-600 border-slate-700 hover:bg-slate-700 border-b border-r dark:bg-slate-900 dark:border-slate-500 dark:hover:bg-slate-800"
            onClick={() => playerRef.current && playerRef.current.pause()}>
            <BsPause color="slate-800" className="dark:text-slate-300" />
          </button>
          <button className="flex items-center justify-center w-12 h-12 bg-slate-600 border-slate-700 hover:bg-slate-700 border-b border-r dark:bg-slate-900 dark:border-slate-500 dark:hover:bg-slate-800">
            <BsTrash3
              onClick={() => {
                clearVideo();
              }}
              color="slate-800"
              className="dark:text-slate-300"
            />
          </button>
          <button
            className="flex items-center justify-center w-12 h-12 bg-slate-600 border-slate-700 hover:bg-slate-700 border-b border-r dark:bg-slate-900 dark:border-slate-500 dark:hover:bg-slate-800"
            onClick={() => playerRef.current && playerRef.current.currentTime(playerRef.current.currentTime() - 5)}>
            <BsSkipBackward color="slate-800" className="dark:text-slate-300" />
          </button>
          <button
            className="flex items-center justify-center w-12 h-12 bg-slate-600 border-slate-700 hover:bg-slate-700 border-b border-r dark:bg-slate-900 dark:border-slate-500 dark:hover:bg-slate-800"
            onClick={() => playerRef.current && playerRef.current.currentTime(playerRef.current.currentTime() + 5)}>
            <BsSkipForward color="slate-800" className="dark:text-slate-300" />
          </button>
          <button className="overflow-hidden flex items-center justify-center w-auto min-w-fit h-12 bg-slate-600 border-slate-700 hover:bg-slate-700 border-b border-r dark:bg-slate-900 dark:border-slate-500 dark:hover:bg-slate-800 dark:text-slate-300 text-slate-800 ">
            {formatTime(progress.current)} / {formatTime(progress.duration)}
          </button>
          <span className="ml-2 whitespace-nowrap overflow-ellipsis overflow-hidden "></span>
          {/* End of button row */}
          <div className="flex flex-space-x-2 justify-end w-full">
            <button
              className="flex items-center justify-center w-12 h-12 bg-slate-600 border-slate-700 hover:bg-slate-700 border-l border-r border-b dark:bg-slate-900 dark:border-slate-500 dark:hover:bg-slate-800"
              onClick={requestFullscreen}>
              <BsArrowsFullscreen color="slate-800" className="dark:text-slate-300" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default PlayerControls;
