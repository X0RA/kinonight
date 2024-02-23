import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useUserStatus } from "../middleware/StateContext";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import "tailwindcss/tailwind.css";
import "./VideoPlayer.css";
import Sidebar from "./sidebar";
import DesktopControls from "./desktopControls";
import MobileControls from "./mobileControls";

export const VideoJS = (props) => {
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const { options, onReady, clearVideo } = props;
  const Navigate = useNavigate();
  const { setVideoInfo } = useUserStatus();

  // mobile controls
  const [isLandscape, setIsLandscape] = useState(window.innerWidth > window.innerHeight);
  const isMobile = /iPhone|iPad|iPod|Android/i.test(window.navigator.userAgent);
  useEffect(() => {
    const handleResize = () => {
      setIsLandscape(window.innerWidth > window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    // Helper function to extract room name from URL
    const extractRoomNameFromURL = (url) => {
      const parts = url.split("/");
      const roomIndex = parts.findIndex((part) => part.toLowerCase() === "room");
      return roomIndex !== -1 && parts[roomIndex + 1] ? parts[roomIndex + 1] : null;
    };
    if (!options && playerRef.current) {
      Navigate(`/room/${extractRoomNameFromURL(window.location.href)}`);
    }
  }, [options]);

  useEffect(() => {
    if (isMobile) {
      console.log("Mobile device detected");
    } else {
      console.log("Desktop device detected");
    }
  }, [isMobile]);

  const [doShowSidebar, setDoShowSidebar] = useState(!isMobile);

  const mainContentClass = doShowSidebar ? "pr-52" : "pl-0"; // pl-52 for padding left equal to the width of the sidebar

  const controlBarRef = useRef(null);
  const observerRef = useRef(null);

  const isMouseOnControlBar = () => {
    return controlBarRef.current && controlBarRef.current.matches(":hover");
  };

  useEffect(() => {
    const checkAndObserve = () => {
      const targetNode = document.querySelector(".vjs-text-track-display");
      if (targetNode && !observerRef.current) {
        const observerCallback = (mutationsList) => {
          let mouseOnBar = isMouseOnControlBar();
          if (mouseOnBar) {
            adjustSubtitlePosition(mouseOnBar);
          }
        };

        observerRef.current = new MutationObserver(observerCallback);
        observerRef.current.observe(targetNode, {
          childList: true,
          subtree: true,
        });
      } else if (!targetNode) {
        setTimeout(checkAndObserve, 1000);
      }
    };

    checkAndObserve();

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, []);

  const adjustSubtitlePosition = (doMove) => {
    const trackDisplay = document.querySelector(".vjs-text-track-display");
    const subDisplay = document.querySelector(".vjs-text-track-cue ");
    const alteredSub = document.querySelector(".altered-subtitle");

    if (trackDisplay && subDisplay) {
      const style = window.getComputedStyle(subDisplay);
      const insetHeight = style.getPropertyValue("inset");
      const cueHeight = parseInt(insetHeight.split(" ")[0].replace("px", ""));
      const subtitleOffset = alteredSub !== null ? ` ${cueHeight + 68}px 0px 0px` : ` ${cueHeight - 68}px 0px 0px`;

      if (doMove) {
        subDisplay.style.setProperty("inset", subtitleOffset);
        subDisplay.classList.add("altered-subtitle");
      }
      if (!doMove && alteredSub) {
        alteredSub.style.setProperty("inset", subtitleOffset);
        alteredSub.classList.remove("altered-subtitle");
      }
    }
  };

  // Define state for video progress
  const [progress, setProgress] = useState({
    current: 0,
    duration: 0,
    percentage: 0,
  });

  useEffect(() => {
    if (!playerRef.current) {
      const videoElement = document.createElement("video-js");

      videoElement.classList.add("video-js", "vjs-default-skin", "vjs-16-9", "vjs-big-play-centered");

      videoElement.style.width = "100%";
      videoElement.style.height = "100%";

      videoRef.current.appendChild(videoElement);

      const player = (playerRef.current = videojs(videoElement, options, () => {
        onReady && onReady(player);
      }));

      player.on("timeupdate", () => {
        setProgress({
          current: player.currentTime(),
          duration: player.duration(),
          percentage: (player.currentTime() / player.duration()) * 100,
        });
      });
    }
  }, [options, videoRef]);

  const logOut = () => {
    document.cookie = "room=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    setVideoInfo(null);
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
    <>
      {/* portrait or landscape
      {isMobile && isLandscape && <div className="text-white">Device is in landscape mode</div>}
      {isMobile && !isLandscape && <div className="text-white">Device is in portrait mode</div>} */}
      {/* Sidebar */}
      <div className={`${doShowSidebar ? "absolute h-screen w-52" : "hidden"}`}>
        <Sidebar />
      </div>
      <div className={`h-screen w-full ${mainContentClass}`}>
        <div data-vjs-player className="relative flex h-full w-full items-center justify-center bg-black">
          {/* if options then render the div */}
          <div
            ref={videoRef}
            className="aspect-[16/9] max-h-screen w-full object-cover"
            style={{ maxWidth: "calc(100vh * 16 / 9)" }}
            autoPlay={true}
            playsInline={true}
          />
          {isMobile ? (
            <MobileControls
              playerRef={playerRef}
              setSidebar={setDoShowSidebar}
              sidebar={doShowSidebar}
              progress={progress}
              logOut={logOut}
              clearVideo={clearVideo}
              formatTime={formatTime}></MobileControls>
          ) : (
            // <div
            // ref={controlBarRef}
            // onMouseEnter={() => {
            //   adjustSubtitlePosition(true);
            // }}
            // onMouseLeave={() => {
            //   adjustSubtitlePosition(false);
            // }}
            // className="control-bar bg-primary-500 h-18 w-full absolute bottom-0 opacity-100">
            <div
              ref={controlBarRef}
              onMouseEnter={() => {
                adjustSubtitlePosition(true);
              }}
              onMouseLeave={() => {
                adjustSubtitlePosition(false);
              }}
              className="control-bar bg-primary-500 h-18 absolute bottom-0 w-full opacity-0 transition-opacity duration-200 hover:opacity-100">
              <DesktopControls
                playerRef={playerRef}
                setSidebar={setDoShowSidebar}
                sidebar={doShowSidebar}
                progress={progress}
                logOut={logOut}
                clearVideo={clearVideo}
                formatTime={formatTime}></DesktopControls>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default VideoJS;
