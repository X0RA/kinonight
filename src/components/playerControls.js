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

const PlayerControls = ({ playerRef, progress, logOut, formatTime }) => {
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
    <div className="col-span-3 bg-primary-500 h-16 w-full">
      <div className="flex justify-between items-center p-2 bg-secondary-400">
        <button
          className="logout-button bg-secondary-700 rounded-full flex items-center justify-center w-12 h-12"
          onClick={logOut}>
          <GoSignOut className="logout-icon" />
        </button>
        <button
          onClick={() => playerRef.current && playerRef.current.play()}
          className="bg-secondary-700 rounded-full flex items-center justify-center w-12 h-12">
          <BsPlay className="fullscreen-icon" />
        </button>
        <button
          className="bg-secondary-700 rounded-full flex items-center justify-center w-12 h-12"
          onClick={() => playerRef.current && playerRef.current.pause()}>
          <BsPause className="fullscreen-icon" />
        </button>
        <button className="bg-secondary-700 rounded-full flex items-center justify-center w-12 h-12">
          <BsTrash3 className="fullscreen-icon" />
        </button>
        <button
          className="bg-secondary-700 rounded-full flex items-center justify-center w-12 h-12"
          onClick={() => playerRef.current && playerRef.current.currentTime(playerRef.current.currentTime() - 5)}>
          <BsSkipBackward className="fullscreen-icon" />
        </button>
        <button
          className="bg-secondary-700 rounded-full flex items-center justify-center w-12 h-12"
          onClick={() => playerRef.current && playerRef.current.currentTime(playerRef.current.currentTime() + 5)}>
          <BsSkipForward className="fullscreen-icon" />
        </button>
        <div
          className="w-full flex items-center bg-gray-200 rounded-full dark:bg-gray-700 overflow-visible"
          onClick={handleProgressBarClick}>
          <div
            id="progress-bar"
            className="bg-primary-200 text-xs font-medium text-blue-100 text-center p-3 leading-none rounded-full"
            style={{ width: `${progress.percentage}%` }}></div>
          <span className="ml-2 whitespace-nowrap overflow-ellipsis overflow-hidden">
            {formatTime(progress.current)} / {formatTime(progress.duration)}
          </span>
        </div>
        <button
          className="bg-secondary-700 rounded-full flex items-center justify-center w-12 h-12 relative"
          onClick={toggleVolumeBar}>
          <BsVolumeDown className="fullscreen-icon" />
          {isVolumeBarVisible && (
            <div className="absolute top-full mt-2 w-24 bg-white p-2 rounded-lg shadow flex items-center justify-center">
              <input type="range" min="0" max="100" value={volume} className="w-full" onChange={changeVolume} />
            </div>
          )}
        </button>
        <button
          className="bg-secondary-700 rounded-full flex items-center justify-center w-12 h-12"
          onClick={requestFullscreen}>
          <BsArrowsFullscreen className="fullscreen-icon" />
        </button>
      </div>
    </div>
  );
};

export default PlayerControls;
