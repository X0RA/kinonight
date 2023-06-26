import React, { useState, useEffect } from "react";
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

import { useUserStatus } from "../middleware/StateContext";

const PlayerControls = ({ playerRef, progress, logOut, formatTime, clearVideo }) => {
  const { chosenRoom, setRoomInfo, roomState, setRoomState } = useUserStatus();

  const [volume, setVolume] = useState(50);
  const changeVolume = (event) => {
    const newVolume = event.target.value;
    setVolume(newVolume);
    if (playerRef.current) {
      playerRef.current.volume(newVolume / 100);
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

    const videoState = {
      video_length: progress.duration,
      video_position: seekTime,
      last_update_time: Date.now(),
    };
    setRoomState(videoState);
  };

  const [stateSnapshot, setStateSnapshot] = useState(null);

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

  useEffect(() => {
    if (stateSnapshot) {
      // ideal video position
      const currentTimeInMs = new Date().getTime();
      const lastUpdateTimeInMs = roomState.last_update_time;
      const offsetInSeconds = (currentTimeInMs - lastUpdateTimeInMs) / 1000;
      const videoPosition = roomState.video_position || 0;
      const newVideoPosition = videoPosition + offsetInSeconds;

      // Update the msOffset state
      setMsOffset(newVideoPosition - progress.current);
    }
  }, [stateSnapshot, progress.current]);

  useEffect(() => {
    const syncVideoState = async () => {
      await checkPlayerReadyState(playerRef);
      if (roomState) {
        // this means its a first load
        if (!stateSnapshot) {
          setStateSnapshot(roomState);
          if (roomState.is_playing) {
            playerRef.current.play();
          } else {
            playerRef.current.pause();
          }
          const currentTimeInMs = new Date().getTime();
          const lastUpdateTimeInMs = roomState.last_update_time;
          const offsetInSeconds = (currentTimeInMs - lastUpdateTimeInMs) / 1000;
          const videoPosition = roomState.video_position || 0;
          const newVideoPosition = videoPosition + offsetInSeconds;
          playerRef.current.currentTime(newVideoPosition);
        } else if (stateSnapshot !== roomState) {
          if (roomState.is_playing) {
            playerRef.current.play();
          } else if (!roomState.is_playing) {
            playerRef.current.pause();
          }
          if (roomState.video_position !== progress.current) {
            playerRef.current.currentTime(roomState.video_position);
          }
          setStateSnapshot(roomState);
        }
      }
    };

    syncVideoState();
  }, [roomState, playerRef]);

  const play = () => {
    if (playerRef.current) {
      // playerRef.current.play();
      const videoState = {
        is_playing: true,
        video_length: progress.duration,
        video_position: progress.current,
        last_update_time: Date.now(),
      };
      setRoomState(videoState);
    }
  };

  const pause = () => {
    if (playerRef.current) {
      // playerRef.current.pause();
      const videoState = {
        is_playing: false,
        video_length: progress.duration,
        video_position: progress.current,
        last_update_time: Date.now(),
      };
      setRoomState(videoState);
    }
  };

  const rewind = () => {
    if (playerRef.current) {
      const newTime = playerRef.current.currentTime() - 5;
      // playerRef.current.currentTime(newTime);
      const videoState = {
        video_length: progress.duration,
        video_position: newTime,
        last_update_time: Date.now(),
      };
      setRoomState(videoState);
    }
  };

  const ff = () => {
    if (playerRef.current) {
      const newTime = playerRef.current.currentTime() + 5;
      // playerRef.current.currentTime(newTime);
      const videoState = {
        video_length: progress.duration,
        video_position: newTime,
        last_update_time: Date.now(),
      };
      setRoomState(videoState);
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
            onClick={play}
            className="flex items-center justify-center w-12 h-12 bg-slate-600 border-l border-b border-r border-slate-700 hover:bg-slate-700 dark:bg-slate-900 dark:border-slate-500 dark:hover:bg-slate-800">
            <BsPlay color="slate-800" className="dark:text-slate-300" />
          </button>
          <button
            className="flex items-center justify-center w-12 h-12 bg-slate-600 border-slate-700 hover:bg-slate-700 border-b border-r dark:bg-slate-900 dark:border-slate-500 dark:hover:bg-slate-800"
            onClick={pause}>
            <BsPause color="slate-800" className="dark:text-slate-300" />
          </button>
          <button className="flex items-center justify-center w-12 h-12 bg-slate-600 border-slate-700 hover:bg-slate-700 border-b border-r dark:bg-slate-900 dark:border-slate-500 dark:hover:bg-slate-800">
            <BsTrash3
              onClick={() => {
                setRoomInfo({
                  video_name: "",
                  video_url: "",
                  subtitle_url: "",
                  room_password: "",
                  video_info: {},
                });
              }}
              color="slate-800"
              className="dark:text-slate-300"
            />
          </button>
          <button
            className="flex items-center justify-center w-12 h-12 bg-slate-600 border-slate-700 hover:bg-slate-700 border-b border-r dark:bg-slate-900 dark:border-slate-500 dark:hover:bg-slate-800"
            onClick={rewind}>
            <BsSkipBackward color="slate-800" className="dark:text-slate-300" />
          </button>
          <button
            className="flex items-center justify-center w-12 h-12 bg-slate-600 border-slate-700 hover:bg-slate-700 border-b border-r dark:bg-slate-900 dark:border-slate-500 dark:hover:bg-slate-800"
            onClick={ff}>
            <BsSkipForward color="slate-800" className="dark:text-slate-300" />
          </button>
          <button className="overflow-hidden flex items-center justify-center w-auto min-w-fit h-12 bg-slate-600 border-slate-700 hover:bg-slate-700 border-b border-r dark:bg-slate-900 dark:border-slate-500 dark:hover:bg-slate-800 dark:text-slate-300 text-slate-800 ">
            {formatTime(progress.current)} / {formatTime(progress.duration)}
          </button>
          <button
            onClick={() => {
              playerRef.current.currentTime(progress.current + msOffset);
            }}
            className="overflow-hidden flex items-center justify-center w-auto min-w-fit h-12  bg-slate-600 border-slate-700 hover:bg-slate-700 border-b border-r dark:bg-slate-900 dark:border-slate-500 dark:hover:bg-slate-800 dark:text-slate-300 text-slate-800 ">
            {msOffset}
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
