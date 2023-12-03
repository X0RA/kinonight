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
  BsLockFill,
  BsLock,
  BsEmojiAngry,
  BsCCircle,
  BsShieldLock,
} from "react-icons/bs";
import { useCookies } from "react-cookie";
import { useUserStatus } from "../middleware/StateContext";
import { useAuth } from "../middleware/AuthContext";
import EmojiPicker from "emoji-picker-react";
import { Theme } from "emoji-picker-react";

const PlayerControls = ({ playerRef, progress, logOut, formatTime, clearVideo, sidebar, setSidebar }) => {
  const [cookies, setCookie] = useCookies(["roompw", "volumepercent"]);
  const { chosenRoom, setVideoInfo, roomState, setRoomState, videoInfo, roomInfo, setRoomInfo } = useUserStatus();
  const { utcTime } = useAuth();

  const [showTimeLeft, setShowTimeLeft] = useState(false);

  // lock controls
  const [isLocked, setIsLocked] = useState(true);
  const [roomIsLocked, setRoomIsLocked] = useState(true);
  const [showLockDialog, setShowLockDialog] = useState(false);
  const [lockPassword, setLockPassword] = useState("");
  const [showUnlockDiaglog, setShowUnlockDialog] = useState(false);

  const setPasswordLock = async () => {
    try {
      setCookie("roompw", chosenRoom + ":" + lockPassword, { path: "/", sameSite: "Strict" });
      await setRoomInfo({
        ...roomInfo,
        room_password: lockPassword,
      });
      setRoomIsLocked(true);
    } catch (error) {
      console.error("Error setting lock password:", error);
    }
  };

  const attemptUnlock = async () => {
    try {
      if (lockPassword == roomInfo.room_password) {
        setCookie("roompw", chosenRoom + ":" + lockPassword, { path: "/", sameSite: "Strict" });
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error("Error verifying lock password:", error);
    }
  };

  const unlockControls = async () => {
    try {
      setCookie("roompw", chosenRoom + ":" + "", { path: "/", sameSite: "Strict" });
      setLockPassword("");
      await setRoomInfo({
        ...roomInfo,
        room_password: "",
      });
      setIsLocked(false);
      setRoomIsLocked(false);
    } catch (error) {
      console.error("Error setting lock password:", error);
    }
  };

  useEffect(() => {
    let cookie = "";
    if (cookies["roompw"]) {
      cookie = cookies["roompw"].split(":")[1];
    }
    const checkLockStatus = async () => {
      try {
        const userLockStatus =
          lockPassword == roomInfo.room_password ||
          roomInfo.room_password == "" ||
          cookie == roomInfo.room_password ||
          roomInfo.room_password === undefined;
        setIsLocked(!userLockStatus);
        setRoomIsLocked(roomInfo.room_password != "");
      } catch (error) {
        console.error("Error verifying lock password:", error);
      }
    };

    checkLockStatus();
  }, [roomInfo, lockPassword]);

  // Emoji picker controls
  const [isEmojiOpen, setIsEmojiOpen] = useState(false);

  const pushEmoji = (emoji) => {
    setRoomInfo({
      ...roomInfo, // keep the old room info
      reactionEmoji: emoji + ":" + Math.random().toString(36).substr(2, 9),
    });
  };

  // Volume logic
  const [volume, setVolume] = useState();
  const changeVolume = (event) => {
    const newVolume = event.target.value;
    setCookie("volumepercent", newVolume, { path: "/", sameSite: "Strict" });
    setVolume(newVolume);
    if (playerRef.current) {
      playerRef.current.volume(newVolume / 100);
    }
  };

  // subtitle controls
  const toggleSubtitles = () => {
    // Assuming playerRef.current holds your video.js player instance
    if (playerRef.current) {
      const player = playerRef.current;

      // Get all text tracks of the video player
      const textTracks = player.textTracks();
      // Loop through the text tracks
      for (let i = 0; i < textTracks.length; i++) {
        const track = textTracks[i];
        // Check if the track is of kind 'subtitles'
        if (track.kind === "subtitles" || track.kind === "captions") {
          // Toggle the showing mode of the track
          if (track.mode === "showing") {
            track.mode = "disabled";
          } else {
            track.mode = "showing";
          }
        }
      }
    }
  };

  useEffect(() => {
    console.log("setting volume");
    if (cookies["volumepercent"]) {
      setVolume(cookies["volumepercent"]);
    } else {
      setVolume(100);
    }
  }, [playerRef]);

  const requestFullscreen = () => {
    const doc = document.documentElement;

    // Check if full-screen mode is already active
    if (
      document.fullscreenElement ||
      document.mozFullScreenElement ||
      document.webkitFullscreenElement ||
      document.msFullscreenElement
    ) {
      // Exit full-screen mode
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    } else {
      // Enter full-screen mode
      if (doc.requestFullscreen) {
        doc.requestFullscreen();
      } else if (doc.mozRequestFullScreen) {
        doc.mozRequestFullScreen();
      } else if (doc.webkitRequestFullscreen) {
        doc.webkitRequestFullscreen();
      } else if (doc.msRequestFullscreen) {
        doc.msRequestFullscreen();
      }
    }
  };
  const handleProgressBarClick = (event) => {
    if (!isLocked) {
      const progressBar = event.currentTarget;
      const progressBarRect = progressBar.getBoundingClientRect();
      const clickPosition = event.clientX - progressBarRect.left;
      const progressBarWidth = progressBarRect.width;
      const seekPercentage = (clickPosition / progressBarWidth) * 100;
      const seekTime = (seekPercentage / 100) * progress.duration;

      const videoState = {
        video_length: progress.duration,
        video_position: seekTime,
        last_update_time: utcTime(),
      };
      setRoomState(videoState);
    }
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
  const [msOffsetMessage, setMsOffsetMessage] = useState("");

  useEffect(() => {
    if (stateSnapshot) {
      // ideal video position
      const currentTimeInMs = utcTime();
      const lastUpdateTimeInMs = roomState.last_update_time;
      const offsetInSeconds = (currentTimeInMs - lastUpdateTimeInMs) / 1000;
      const videoPosition = roomState.video_position || 0;
      const newVideoPosition = videoPosition + offsetInSeconds;

      // Update the msOffset state with two decimal places
      const offsetFormatted = +(newVideoPosition - progress.current).toFixed(2);
      setMsOffset(offsetFormatted);
      if (offsetFormatted > 1.1 || offsetFormatted < -1.1) {
        setMsOffsetMessage(`Out of sync (${offsetFormatted}))`);
      } else {
        setMsOffsetMessage("In Sync");
      }
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
        last_update_time: utcTime(),
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
        last_update_time: utcTime(),
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
        last_update_time: utcTime(),
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
        last_update_time: utcTime(),
      };
      setRoomState(videoState);
    }
  };

  return (
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
          className={`flex items-center justify-center w-12 h-12 bg-slate-600 border-slate-700 hover:bg-slate-700 dark:bg-slate-900 dark:border-slate-500 dark:hover:bg-slate-800${
            isLocked ? "border-l border-b border-r" : "border-b  "
          }`}
          onClick={logOut}>
          <GoSignOut color="slate-800" className="dark:text-slate-300" />
        </button>
        {!isLocked && (
          <>
            {/* play button */}
            <button
              onClick={play}
              className="flex items-center justify-center w-12 h-12 bg-slate-600 border-l border-b border-r border-slate-700 hover:bg-slate-700 dark:bg-slate-900 dark:border-slate-500 dark:hover:bg-slate-800">
              <BsPlay color="slate-800" className="dark:text-slate-300" />
            </button>

            {/* pause button */}
            <button
              className="flex items-center justify-center w-12 h-12 bg-slate-600 border-slate-700 hover:bg-slate-700 border-b border-r dark:bg-slate-900 dark:border-slate-500 dark:hover:bg-slate-800"
              onClick={pause}>
              <BsPause color="slate-800" className="dark:text-slate-300" />
            </button>

            <button className="flex items-center justify-center w-12 h-12 bg-slate-600 border-slate-700 hover:bg-slate-700 border-b border-r dark:bg-slate-900 dark:border-slate-500 dark:hover:bg-slate-800">
              <BsTrash3
                onClick={() => {
                  setVideoInfo({
                    video_name: "",
                    video_url: "",
                    subtitle_url: "",
                    room_password: "",
                    video_info: {},
                  });
                  setRoomInfo({
                    ...roomInfo,
                    chatMessages: [],
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
          </>
        )}
        {/* lock the controls */}
        <button
          className={`flex items-center justify-center w-12 h-12 bg-slate-600 border-slate-700 hover:bg-slate-700 dark:bg-slate-900 dark:border-slate-500 dark:hover:bg-slate-800 border-r border-b`}
          onClick={() => {
            if (!isLocked) {
              setShowLockDialog(true);
            } else {
              setShowUnlockDialog(true);
            }
          }}>
          <BsLockFill color="slate-800" className={`${roomIsLocked ? "text-secondary-300" : "text-emerald-300"}`} />
        </button>
        {showLockDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-4 w-auto">
              <div className="flex flex-col items-center">
                <h1 className="text-xl font-bold">Lock Controls</h1>
                <p className="text-xl text-center pt-4 pb-4">
                  This will lock the controls for everyone in the room. Only the room owner can unlock the controls.
                </p>
                <input
                  placeholder="Enter password"
                  className="text-center p-2 rounded-lg mb-4 border-2 border-primary-200 w-64"
                  onKeyPress={(e) => {
                    if (!/^[a-zA-Z]+$/.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                  onChange={(e) => {
                    setLockPassword(e.target.value);
                  }}
                  value={lockPassword}
                />
                <div className="flex space-x-4">
                  <button
                    onClick={() => {
                      setPasswordLock();
                      setShowLockDialog(false);
                    }}
                    className={`bg-primary-500 rounded-lg px-4 py-2 text-white font-semibold${
                      lockPassword ? "" : " opacity-50"
                    }`}
                    disabled={!lockPassword}>
                    Lock
                  </button>

                  <button
                    onClick={() => {
                      setShowLockDialog(false);
                    }}
                    className="bg-primary-500 rounded-lg px-4 py-2 text-white font-semibold">
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      unlockControls();
                      setShowLockDialog(false);
                    }}
                    disabled={!roomIsLocked}
                    className={`bg-primary-500 rounded-lg px-4 py-2 text-white font-semibold${
                      roomIsLocked ? "" : " opacity-50"
                    }`}>
                    {roomIsLocked ? "Unlock" : "Already unlocked"}
                  </button>
                  <button
                    onClick={() => {
                      setIsLocked(true);
                      setLockPassword("");
                      setRoomIsLocked(true);
                      setCookie("roompw", chosenRoom + ":" + "", { path: "/", sameSite: "Strict" });
                      setShowLockDialog(false);
                    }}
                    className={`bg-primary-500 rounded-lg px-4 py-2 text-white font-semibold`}>
                    Take away my control
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {showUnlockDiaglog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-4 w-auto">
              <div className="flex flex-col items-center">
                <h1 className="text-xl font-bold">Unlock controls (for yourself)</h1>
                <p className="text-xl text-center pt-4 pb-4">Do you know the password?!</p>
                <input
                  placeholder="Enter password"
                  className="text-center p-2 rounded-lg mb-4 border-2 border-primary-200 w-64"
                  onKeyPress={(e) => {
                    if (!/^[a-zA-Z]+$/.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                  onChange={(e) => {
                    setLockPassword(e.target.value);
                  }}
                  value={lockPassword}
                />
                <div className="flex space-x-4">
                  <button
                    onClick={() => {
                      attemptUnlock().then((result) => {
                        if (result) {
                          setShowUnlockDialog(false);
                        } else {
                          alert("Wrong password!");
                        }
                      });
                    }}
                    className={`bg-primary-500 rounded-lg px-4 py-2 text-white font-semibold${
                      lockPassword ? "" : " opacity-50"
                    }`}
                    disabled={!lockPassword}>
                    Unlock
                  </button>
                  <button
                    onClick={() => {
                      setShowUnlockDialog(false);
                    }}
                    className="bg-primary-500 rounded-lg px-4 py-2 text-white font-semibold">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* end of lock controls */}

        {/* subtitle control */}
        {videoInfo.subtitle_url && (
          <button
            className="flex items-center justify-center w-12 h-12 bg-slate-600 border-slate-700 hover:bg-slate-700 border-b border-r dark:bg-slate-900 dark:border-slate-500 dark:hover:bg-slate-800"
            onClick={() => {
              toggleSubtitles();
            }}>
            <BsCCircle color="slate-800" className="dark:text-slate-300" />
          </button>
        )}

        {/* emoji controls */}
        <div className="relative">
          {/* emoji controls */}
          <button
            className="flex items-center justify-center w-12 h-12 bg-slate-600 border-slate-700 hover:bg-slate-700 border-b border-r dark:bg-slate-900 dark:border-slate-500 dark:hover:bg-slate-800"
            onClick={() => {
              setIsEmojiOpen(!isEmojiOpen);
            }}>
            <BsEmojiAngry color="slate-800" className="dark:text-slate-300" />
          </button>

          {isEmojiOpen && (
            <div
              style={{
                position: "absolute",
                zIndex: 1000,
                bottom: "100%", // positions the picker above the button
                left: "600px", // adjusts horizontal positioning
                transform: "translateX(-50%)", // centers the picker above the button
              }}>
              <EmojiPicker
                onEmojiClick={(event, emojiObject) => {
                  pushEmoji(event.emoji);
                }}
                theme={Theme.DARK}
                pickerStyle={{
                  width: "200px",
                }}
                disableSearchBar={true}
                disableSkinTonePicker={true}
              />
            </div>
          )}
        </div>

        {/* sidebar toggle */}
        <button
          className={`flex items-center justify-center w-12 h-12 bg-slate-600 border-slate-700 hover:bg-slate-700 dark:bg-slate-900 dark:border-slate-500 dark:hover:bg-slate-800 border-r border-b`}
          onClick={() => {
            setSidebar(!sidebar);
          }}>
          <BsShieldLock color="slate-800" className={`${roomIsLocked ? "text-secondary-300" : "text-emerald-300"}`} />
        </button>

        {/* time info */}
        <button
          className="overflow-hidden flex items-center justify-center w-auto min-w-fit h-12 bg-slate-600 border-slate-700 hover:bg-slate-700 border-b border-r dark:bg-slate-900 dark:border-slate-500 dark:hover:bg-slate-800 dark:text-slate-300 text-slate-800 "
          onClick={() => {
            setShowTimeLeft(!showTimeLeft);
          }}>
          {!showTimeLeft
            ? `${formatTime(progress.current)} / ${formatTime(progress.duration)}`
            : `${formatTime(progress.duration - progress.current)}`}
        </button>
        <button
          onClick={() => {
            playerRef.current.currentTime(progress.current + msOffset);
          }}
          className="overflow-hidden flex items-center justify-center w-auto min-w-fit h-12  bg-slate-600 border-slate-700 hover:bg-slate-700 border-b border-r dark:bg-slate-900 dark:border-slate-500 dark:hover:bg-slate-800 dark:text-slate-300 text-slate-800 ">
          {msOffsetMessage}
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
  );
};

export default PlayerControls;
