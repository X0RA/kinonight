import React, { useState, useEffect } from "react";
import { Play, Pause, PlayForward, PlayBack } from "@styled-icons/ionicons-solid";
import { Trash, Lock, Unlock } from "@styled-icons/fa-solid";
import { Exit } from "@styled-icons/ionicons-solid";
import { EmojiAdd } from "@styled-icons/fluentui-system-filled";
import { SidebarCollapse } from "@styled-icons/octicons";
import { FullScreenMaximize } from "@styled-icons/fluentui-system-regular";
import { Settings } from "@styled-icons/fluentui-system-filled";
import { Subtitles } from "@styled-icons/material-rounded/Subtitles";
import { VolumeMute, VolumeDown, VolumeUp, ArrowIosBack, ArrowIosForward } from "@styled-icons/evaicons-solid";
import { useUserStatus } from "../middleware/StateContext";
import { useCookies } from "react-cookie";
import { useAuth } from "../middleware/AuthContext";

const MobileControls = ({ playerRef, setSidebar, sidebar, progress, logOut, clearVideo, formatTime }) => {
  const [cookies, setCookie] = useCookies(["roompw", "volumepercent"]);
  const {
    chosenRoom,
    setChosenRoom,
    connectedUsers,
    videoInfo, // For subtitle show / hide
    setVideoInfo,
    roomState,
    setRoomState,
    videoState,
    setVideoState,
    roomInfo,
    setRoomInfo,
  } = useUserStatus();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const controlsVisibilityStyle = isVisible ? "opacity-100 pointer-events-auto" : "opacity-0";
  const buttonUsability = isVisible ? "pointer-events-auto" : "pointer-events-none";
  const [stateSnapshot, setStateSnapshot] = useState(null);
  const { utcTime } = useAuth();
  const [showSettings, setShowSettings] = useState(false);

  const toggleVisibility = (event) => {
    event.stopPropagation();
    setIsVisible(!isVisible);
  };

  const handleButtonClick = (event) => {
    event.stopPropagation();
    // handle button click
  };

  const checkPlayerReadyState = async (playerRef) => {
    return new Promise((resolve) => {
      const checkReadyState = setInterval(() => {
        if (playerRef.current.readyState() > 0) {
          clearInterval(checkReadyState);
          resolve(true);
        }
      }, 50);
    });
  };

  const [msOffset, setMsOffset] = useState(0);
  const [msOffsetMessage, setMsOffsetMessage] = useState({ sync: true, offset: "0ms" });

  useEffect(() => {
    if (stateSnapshot) {
      // ideal video position
      const currentTimeInMs = utcTime();
      const lastUpdateTimeInMs = videoState.last_update_time;
      const offsetInSeconds = (currentTimeInMs - lastUpdateTimeInMs) / 1000;
      const videoPosition = videoState.video_position || 0;
      const newVideoPosition = videoPosition + offsetInSeconds;

      // Update the msOffset state with two decimal places
      const offsetFormatted = +(newVideoPosition - progress.current).toFixed(2);
      setMsOffset(offsetFormatted);
      if (offsetFormatted > 1.1 || offsetFormatted < -1.1) {
        setMsOffsetMessage({
          sync: false,
          offset: `${offsetFormatted}ms`,
        });
      } else {
        setMsOffsetMessage({ sync: true, offset: `${offsetFormatted}ms` });
      }
    }
  }, [stateSnapshot, progress.current]);

  useEffect(() => {
    const syncVideoState = async () => {
      await checkPlayerReadyState(playerRef);
      if (videoState) {
        // this means its a first load
        // cookies volume logic
        if (cookies["volumepercent"]) {
          changeVolume(cookies["volumepercent"]);
        }
        if (!stateSnapshot) {
          setStateSnapshot(videoState);
          if (videoState.is_playing) {
            playerRef.current.play();
          } else {
            playerRef.current.pause();
          }
          const currentTimeInMs = new Date().getTime();
          const lastUpdateTimeInMs = videoState.last_update_time;
          const offsetInSeconds = (currentTimeInMs - lastUpdateTimeInMs) / 1000;
          const videoPosition = videoState.video_position || 0;
          const newVideoPosition = videoPosition + offsetInSeconds;
          playerRef.current.currentTime(newVideoPosition);
        } else if (stateSnapshot !== videoState) {
          if (videoState.is_playing) {
            playerRef.current.play();
          } else if (!videoState.is_playing) {
            playerRef.current.pause();
          }
          if (videoState.video_position !== progress.current) {
            playerRef.current.currentTime(videoState.video_position);
          }
          setStateSnapshot(videoState);
        }
      }
    };

    syncVideoState();
  }, [videoState, playerRef]);

  //#region volume
  const [volume, setVolume] = useState(100);
  const [oldVolume, setOldVolume] = useState(null);
  const changeVolume = (newVolume) => {
    const intNewVolume = parseInt(newVolume, 10) || 0;
    setCookie("volumepercent", intNewVolume, { path: "/", sameSite: "Strict" });
    setOldVolume(parseInt(volume, 10));
    setVolume(intNewVolume);
    if (playerRef.current) {
      playerRef.current.volume(intNewVolume / 100);
    }
  };
  //#endregion

  //#region play, pause, rewind, forward
  const play = () => {
    if (playerRef.current) {
      const newVideoState = {
        is_playing: true,
        video_length: progress.duration,
        video_position: progress.current,
        last_update_time: utcTime(),
      };
      setVideoState(newVideoState);
    }
  };

  const pause = () => {
    if (playerRef.current) {
      const newVideoState = {
        is_playing: false,
        video_length: progress.duration,
        video_position: progress.current,
        last_update_time: utcTime(),
      };
      setVideoState(newVideoState);
    }
  };

  const rewind = () => {
    if (playerRef.current) {
      const newTime = playerRef.current.currentTime() - 30;
      const newVideoState = {
        video_length: progress.duration,
        video_position: newTime,
        last_update_time: utcTime(),
      };
      setVideoState(newVideoState);
    }
  };

  const ff = () => {
    if (playerRef.current) {
      const newTime = playerRef.current.currentTime() + 30;
      const newVideoState = {
        video_length: progress.duration,
        video_position: newTime,
        last_update_time: utcTime(),
      };
      setVideoState(newVideoState);
    }
  };
  //#endregion

  return (
    <div className="absolute w-full h-full" onClick={toggleVisibility}>
      {/* overlays and whatnot */}
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-slate-800 rounded-lg p-4 max-w-sm mx-auto text-slate-300 flex flex-col">
            <p>No settings implemented yet dummy</p>
            <button className="rounded-lg bg-slate-700 p-4 mt-2 justify-center " onClick={() => setShowSettings(false)}>
              Close settings
            </button>
          </div>
        </div>
      )}
      {/* start of normal controls */}
      <div
        className={` inset-0 bg-black bg-opacity-25 flex items-center justify-center transition-transform transition-opacity duration-300 ${controlsVisibilityStyle} `}>
        {/* top left */}
        <div className="left-5 top-5 absolute">
          <button
            className={`text-slate-400 focus:outline-none ${buttonUsability}`}
            aria-label="Exit"
            onClick={() => logOut()}>
            <Exit size="38" />
          </button>
        </div>

        {/* top right */}
        <div className="right-5 top-5 absolute">
          <button
            className={`text-slate-400 focus:outline-none ${buttonUsability}`}
            aria-label="Exit"
            onClick={() => setShowSettings(!showSettings)}>
            <Settings size="38" />
          </button>
        </div>
        {/* middle far right */}
        <div className="absolute right-5 top-1/2 transform -translate-y-1/2">
          <button
            className={`text-white hover:text-gray-300 focus:outline-none ${buttonUsability}`}
            aria-label="Show Sidebar"
            onClick={() => {
              setSidebar(!sidebar);
            }}>
            <ArrowIosBack
              className={`dark:text-slate-300 ${!sidebar ? "" : "transform rotate-180"} ${buttonUsability}`}
              size="38"
            />
          </button>
        </div>

        {/* bottom right */}
        <div className="absolute right-5 bottom-20">
          <button
            title="Sync offset"
            className={` rounded-full pl-6 relative overflow-hidden flex items-center justify-center w-auto min-w-fit h-11 bg-slate-800 text-slate-300  ${buttonUsability} ${
              msOffsetMessage.sync ? "" : "pr-2"
            }`}
            onClick={() => {
              playerRef.current.currentTime(progress.current + msOffset);
            }}>
            {/* Pulsing circle */}
            {msOffsetMessage.sync ? (
              <div className="absolute left-0 ml-2 w-2 h-2 rounded-full animate-ping bg-emerald-800 "></div>
            ) : (
              <div className="absolute left-0 ml-2 w-2 h-2 rounded-full animate-ping bg-red-800"></div>
            )}
            {
              msOffsetMessage.sync
                ? "" // When in sync, display nothing.
                : msOffsetMessage.offset // When out of sync, display the offset message.
            }
          </button>
        </div>
        {/* bottom middle */}
        <div className="absolute right-0 bottom-0 w-full p-4 pb-8">
          <div className="flex items-center h-3 rounded-lg bg-slate-800 overflow-visible">
            <div
              id="progress-bar"
              className="h-full  rounded-lg  bg-slate-500"
              style={{ width: `${progress.percentage}%` }}></div>
          </div>
          {/* time under progress bar */}
          <div className="flex justify-between text-white text-xs ">
            <div>{formatTime(progress.current)}</div>
            <div>{formatTime(progress.duration)}</div>
          </div>
        </div>
        {/* end */}
      </div>
    </div>
  );
};

export default MobileControls;
