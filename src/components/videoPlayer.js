import React, { useState, useEffect, useRef } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import "tailwindcss/tailwind.css";
import "./VideoPlayer.css"; // Import the custom CSS file
import { useNavigate } from "react-router-dom";
import PlayerControls from "./playerControls";
import { useUserStatus } from "../middleware/StateContext";

export const VideoJS = (props) => {
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const { options, onReady, clearVideo } = props;
  const Navigate = useNavigate();
  const { chosenRoom, setRoomInfo, roomState, setRoomState } = useUserStatus();

  // Define state for video progress
  const [progress, setProgress] = useState({ current: 0, duration: 0, percentage: 0 });

  useEffect(() => {
    if (!playerRef.current) {
      const videoElement = document.createElement("video-js");

      videoElement.classList.add("video-js", "vjs-default-skin", "vjs-16-9", "vjs-big-play-centered");

      videoElement.style.width = "100%";
      videoElement.style.height = "100%";

      videoRef.current.appendChild(videoElement);

      const player = (playerRef.current = videojs(videoElement, options, () => {
        videojs.log("player is ready");
        // playerRef.current.pause(); // pause the player initially
        // playerRef.current.currentTime(roomState.video_position || 0); // set the initial time position
        onReady && onReady(player);
      }));

      player.on("timeupdate", () => {
        setProgress({
          current: player.currentTime(),
          duration: player.duration(),
          percentage: (player.currentTime() / player.duration()) * 100,
        });
      });

      // This ensures the video is paused once it's ready
      // player.ready(function () {
      //   player.pause();
      // });
    } else {
      const player = playerRef.current;

      player.autoplay(options.autoplay);
      player.src(options.sources);
    }
  }, [options, videoRef]);

  const logOut = () => {
    document.cookie = "room=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    Navigate("/");
  };

  useEffect(() => {
    const player = playerRef.current;

    return () => {
      if (player && !player.isDisposed()) {
        player.dispose();
        playerRef.current = null;
      }
    };
  }, [playerRef]);

  // Function to format time
  const formatTime = (time) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);
    return `${hours < 10 ? "0" + hours : hours}:${minutes < 10 ? "0" + minutes : minutes}:${
      seconds < 10 ? "0" + seconds : seconds
    }`;
  };

  return (
    <div
      data-vjs-player
      className="w-screen h-screen flex items-center justify-center bg-black relative hover:cursor-pointer">
      <div
        ref={videoRef}
        className="w-full aspect-[16/9] max-h-screen object-cover"
        style={{ maxWidth: "calc(100vh * 16 / 9)" }}
        autoPlay={true}
        playsInline={true}
      />
      <div className="control-bar bg-primary-500 h-18 w-full absolute bottom-0 opacity-0 hover:opacity-100 transition-opacity duration-200">
        {/* <div className="control-bar bg-primary-500 h-18 w-full absolute bottom-0 opacity-100 transition-opacity duration-200"> */}
        <PlayerControls
          playerRef={playerRef}
          progress={progress}
          logOut={logOut}
          clearVideo={clearVideo}
          formatTime={formatTime}></PlayerControls>
      </div>
    </div>
  );
};

export default VideoJS;
