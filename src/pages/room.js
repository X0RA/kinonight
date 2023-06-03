import { useNavigate } from "react-router-dom";
import { VideoJS } from "../components/videoPlayer";
import React, { useState, useEffect } from "react";
import {
  BsArrowsFullscreen,
  BsPlay,
  BsTrash3,
  BsPause,
  BsVolumeDown,
  BsSkipForward,
  BsSkipBackward,
} from "react-icons/bs";
import { GoSignOut } from "react-icons/go";

import ProgressBar from "../components/ProgressBar";

function Room() {
  const Navigate = useNavigate();
  const playerRef = React.useRef(null);

  //   const [progress, setProgress] = useState({});

  const videoJsOptions = {
    autoplay: true,
    controls: false,
    responsive: true,
    fluid: true,
    sources: [
      {
        src: "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_5MB.mp4",
        type: "video/mp4",
      },
    ],
  };

  const logOut = () => {
    document.cookie = "room=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    Navigate("/");
  };

  const updateProgressBar = () => {
    // document.getElementById("progress-bar").style.width = `${progress}%`;
    // document.getElementById("progress-bar").innerHTML = `${formatTime(videoStats.current)} / ${formatTime(
    //   videoStats.duration
    // )}`;
  };

  const handlePlayerReady = (player) => {
    playerRef.current = player;
    player.on("timeupdate", () => {
      let videoStats = {
        current: player.currentTime(),
        duration: player.duration(),
        percentage: (player.currentTime() / player.duration()) * 100,
      };
      //   setProgress(videoStats);
    });
  };

  useEffect(() => {
    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, []);

  return (
    <div className="flex flex-col justify-start items-center h-screen bg-primary-400 space-y-8 pt-20">
      <h1 className="text-5xl font-bold text-white">Kino Night</h1>
      <h2 className="text-3xl font-bold text-white">{window.location.pathname.split("/")[2]}</h2>
      <div className="grid grid-cols-3  w-11/12 h-11/12">
        <div className="col-span-3 relative">
          <div style={{ paddingTop: "56.25%" }}>
            <div className="absolute top-0 left-0 w-full h-full">
              <VideoJS options={videoJsOptions} onReady={handlePlayerReady} />
            </div>
          </div>
        </div>
        <div className="col-span-3 bg-primary-500 h-14">
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
            <ProgressBar></ProgressBar>
            <button
              className="bg-secondary-700 rounded-full flex items-center justify-center w-12 h-12"
              onClick={() => playerRef.current && playerRef.current.volume(0.5)}>
              <BsVolumeDown className="fullscreen-icon" />
            </button>
            <button
              className="bg-secondary-700 rounded-full flex items-center justify-center w-12 h-12"
              onClick={() => playerRef.current && playerRef.current.requestFullscreen()}>
              <BsArrowsFullscreen className="fullscreen-icon" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Room;
