import React, { useState, useEffect, useRef } from "react";

// icons
import { Play, Pause, PlayForward, PlayBack } from "@styled-icons/ionicons-solid";
import { Trash, Lock, Unlock } from "@styled-icons/fa-solid";
import { Exit } from "@styled-icons/ionicons-solid";
import { EmojiAdd } from "@styled-icons/fluentui-system-filled";
import { SidebarCollapse } from "@styled-icons/octicons";
import { FullScreenMaximize } from "@styled-icons/fluentui-system-regular";
import { Audiotrack } from "@styled-icons/material-rounded";
import { Subtitles } from "@styled-icons/material-rounded/Subtitles";
import { VolumeMute, VolumeDown, VolumeUp } from "@styled-icons/evaicons-solid";
import "./desktopControls.css";

import { useCookies } from "react-cookie";
import { useUserStatus } from "../middleware/StateContext";
import { useAuth } from "../middleware/AuthContext";
import EmojiSelector from "./emojiPicker";

const DesktopControls = ({ playerRef, progress, logOut, formatTime, clearVideo, sidebar, setSidebar }) => {
  const [cookies, setCookie] = useCookies(["roompw", "volumepercent"]);
  const { chosenRoom, setVideoInfo, roomState, setRoomState, videoInfo, roomInfo, setRoomInfo } = useUserStatus();
  const { utcTime } = useAuth();
  const [showTimeLeft, setShowTimeLeft] = useState(false);

  //#region lock
  const [isLocked, setIsLocked] = useState(true);
  const [roomIsLocked, setRoomIsLocked] = useState(true);
  const [showLockDialog, setShowLockDialog] = useState(false);
  const [lockPassword, setLockPassword] = useState("");
  const [showUnlockDiaglog, setShowUnlockDialog] = useState(false);
  const [currentAudioTrack, setCurrentAudioTrack] = useState(0);

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
      if (lockPassword === roomInfo.room_password) {
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
          lockPassword === roomInfo.room_password ||
          roomInfo.room_password === "" ||
          cookie === roomInfo.room_password ||
          roomInfo.room_password === undefined;
        setIsLocked(!userLockStatus);
        setRoomIsLocked(roomInfo.room_password !== "");
      } catch (error) {
        console.error("Error verifying lock password:", error);
      }
    };

    checkLockStatus();
  }, [roomInfo, lockPassword]);
  //#endregion

  //#region emoji
  const [isEmojiOpen, setIsEmojiOpen] = useState(false);
  const emojiPickerRef = useRef(null); // Ref for the emoji picker container
  const emojiToggleButtonRef = useRef(null); // ref for the button that toggles the emoji picker visibility

  const handleClickOutside = (event) => {
    if (
      emojiPickerRef.current &&
      !emojiPickerRef.current.contains(event.target) &&
      emojiToggleButtonRef.current &&
      !emojiToggleButtonRef.current.contains(event.target)
    ) {
      setIsEmojiOpen(false);
    }
  };

  useEffect(() => {
    // Attach the event listener
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      // Clean up the event listener
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const pushEmoji = (emoji) => {
    setRoomInfo({
      ...roomInfo, // keep the old room info
      reactionEmoji: emoji + ":" + Math.random().toString(36).substr(2, 9),
    });
  };
  //#endregion

  //#region subtitles
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
  //#endregion

  //#region volume
  const [volume, setVolume] = useState(100);
  const changeVolume = (newVolume) => {
    setCookie("volumepercent", newVolume, { path: "/", sameSite: "Strict" });
    setVolume(newVolume);
    if (playerRef.current) {
      playerRef.current.volume(newVolume / 100);
    }
  };
  //#endregion

  //#region fullscreen
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
  //#endregion

  //#region progressBar
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
  //#endregion

  //#region onload shit

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
  const [msOffsetMessage, setMsOffsetMessage] = useState({ sync: true, offset: "0ms" });

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
      if (roomState) {
        // this means its a first load
        // cookies volume logic
        if (cookies["volumepercent"]) {
          changeVolume(cookies["volumepercent"]);
        }
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
  //#endregion

  //#region play, pause, rewind, forward
  const play = () => {
    if (playerRef.current) {
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
      const newTime = playerRef.current.currentTime() - 30;
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
      const newTime = playerRef.current.currentTime() + 30;
      const videoState = {
        video_length: progress.duration,
        video_position: newTime,
        last_update_time: utcTime(),
      };
      setRoomState(videoState);
    }
  };
  //#endregion

  //   buttons and css
  const buttonCSS =
    "flex items-center w-11 h-11 justify-center bg-slate-600 border-slate-700 hover:bg-slate-700 dark:bg-slate-900 dark:border-slate-500 dark:hover:bg-slate-800";
  const lhsButtons = {
    exit: {
      icon: <Exit color="slate-800" className="dark:text-slate-300 w-5" />,
      onClick: () => {
        logOut();
      },
      // className: `${buttonCSS} ${isLocked ? "border-l border-b border-r" : "border-b"}`,
      className: `${buttonCSS} }`,
      disabled: false,
    },
    trash: {
      icon: <Trash onClick={() => {}} color="slate-800" className="dark:text-slate-300 w-4" />,
      onClick: () => {
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
          reactionEmoji: "",
        });
      },
      className: `${buttonCSS}  `,
      disabled: false,
    },
    playPause: {
      icon:
        roomState && roomState.is_playing !== undefined ? (
          roomState.is_playing ? (
            <Pause color="slate-800" className="dark:text-slate-300 w-5" />
          ) : (
            <Play color="slate-800" className="dark:text-slate-300 w-5" />
          )
        ) : (
          // Default icon if roomState or is_playing is undefined
          <Play color="slate-800" className="dark:text-slate-300 w-5" />
        ),
      onClick: () => {
        if (roomState && roomState.is_playing !== undefined) {
          if (roomState.is_playing) {
            pause();
          } else {
            play();
          }
        } else {
          console.error("Error: roomState or is_playing is undefined");
        }
      },
      className: `${buttonCSS} `,
      disabled: false,
    },
    playBack: {
      icon: <PlayBack color="slate-800" className="dark:text-slate-300 w-5" />,
      onClick: () => {
        rewind();
      },
      className: `${buttonCSS} `,
      disabled: false,
    },
    playForward: {
      icon: <PlayForward color="slate-800" className="dark:text-slate-300 w-5" />,
      onClick: () => {
        ff();
      },
      className: `${buttonCSS} `,
      disabled: false,
    },
    lock: {
      icon: roomIsLocked ? (
        <Lock color="slate-800" className={`${isLocked ? "text-slate-300" : "text-emerald-300"} w-4`} />
      ) : (
        <Unlock color="slate-800" className={`${isLocked ? "text-secondary-300" : "text-slate-300"} w-4`} />
      ),
      onClick: () => {
        if (isLocked) {
          setShowUnlockDialog(true);
        } else {
          setShowLockDialog(true);
        }
      },
      className: `${buttonCSS} `,
      disabled: false,
    },
    subtitles: {
      icon: <Subtitles color="slate-800" className="dark:text-slate-300 w-5" />,
      onClick: () => {
        toggleSubtitles();
      },
      className: `${buttonCSS} ${!videoInfo.subtitle_url ? "hidden" : ""}`,
      disabled: false,
    },
    audioSelect: {
      icon: (
        <div>
          <Audiotrack color="slate-800" className="dark:text-slate-300 w-5"></Audiotrack>
          <p className="text-white">{currentAudioTrack}</p>
        </div>
      ),
      onClick: () => {
        const tracks = playerRef.current?.audioTracks();
        if (tracks && tracks.length > 1) {
          const current = currentAudioTrack;
          const next = (current + 1) % tracks.length;
          tracks[current].enabled = false;
          tracks[next].enabled = true;
          setCurrentAudioTrack(next);
        }
      },
      className: `${buttonCSS} ${playerRef.current?.audioTracks()?.length > 1 ? "" : "hidden"}`,
      disabled: false,
    },
    emojiAdd: {
      icon: <EmojiAdd ref={emojiToggleButtonRef} color="slate-800" className="dark:text-slate-300 w-5" />,
      onClick: () => setIsEmojiOpen(!isEmojiOpen),
      className: `${buttonCSS}`,
      disabled: false,
    },
  };

  const rhsButtons = {
    sidebarCollapse: {
      icon: (
        // <SidebarCollapse color="slate-800" className={`dark:text-slate-300 ${sidebar ? "" : "transform rotate-180"}`} />
        <SidebarCollapse
          color="slate-800"
          className={`dark:text-slate-300 ${sidebar ? "" : "transform rotate-180"} w-5`}
        />
      ),
      onClick: () => setSidebar(!sidebar),
      className: `${buttonCSS}`,
      disabled: false,
    },
    fullScreen: {
      icon: <FullScreenMaximize color="slate-800" className="dark:text-slate-300 w-6" />,
      onClick: () => {
        requestFullscreen();
      },
      className: `${buttonCSS}`,
      disabled: false,
    },
  };

  return (
    <>
      {isEmojiOpen && (
        <div
          ref={emojiPickerRef}
          style={{
            position: "absolute",
            zIndex: 1000,
            bottom: "80px", // positions the picker above the button
            left: "50px", // adjusts horizontal positioning
          }}>
          <EmojiSelector open={isEmojiOpen} setOpen={setIsEmojiOpen} emojiClick={(e) => pushEmoji(e)}></EmojiSelector>
        </div>
      )}
      {/* start of lock controls */}
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
      <div className="bg-slate-600 w-full dark:bg-slate-900">
        {/* Track and volume bar */}
        <div className="flex space-x-4 items-center h-6 w-full  border-slate-700 dark:border-slate-500 pl-5 pr-5">
          <div
            className="w-5/6 flex items-center bg-slate-400 rounded dark:bg-slate-800 overflow-visible"
            onClick={handleProgressBarClick}>
            <div
              id="progress-bar"
              className="bg-slate-200 text-xs font-medium text-slate-100 text-center p-1 leading-none rounded dark:bg-slate-500"
              style={{ width: `${progress.percentage}%` }}></div>
          </div>
          {/* volume bar */}
          {volume < 10 ? (
            <VolumeMute
              onClick={() => {
                changeVolume(0);
              }}
              color="slate-800"
              className="dark:text-slate-300 w-5"
            />
          ) : volume < 50 ? (
            <VolumeDown
              onClick={() => {
                changeVolume(0);
              }}
              color="slate-800"
              className="dark:text-slate-300 w-5"
            />
          ) : (
            <VolumeUp
              onClick={() => {
                changeVolume(0);
              }}
              color="slate-800"
              className="dark:text-slate-300 w-5"
            />
          )}
          <input
            id="small-range"
            type="range"
            value={volume}
            onChange={(event) => {
              changeVolume(event.target.value);
            }}
            className="accent-primary-500 w-1/6 h-2 rounded appearance-none cursor-pointer range-sm dark:bg-slate-500 rounded-lg slider-track-custom"
          />
        </div>

        {/* Bottom lhs buttons */}
        <div className="flex justify-between h-11 w-full">
          <div className="flex space-x-0">
            {Object.keys(lhsButtons).map((key) => {
              if (["playPause", "playBack", "playForward", "trash"].includes(key) && isLocked) {
                return null;
              } else {
                return (
                  <button
                    key={key}
                    className={lhsButtons[key].className}
                    onClick={lhsButtons[key].onClick}
                    disabled={lhsButtons[key].disabled}>
                    {lhsButtons[key].icon}
                  </button>
                );
              }
            })}
            {/* time info */}
            <button
              className="overflow-hidden flex items-center justify-center w-auto min-w-fit h-11 bg-slate-600 border-slate-700 hover:bg-slate-700 border- dark:bg-slate-900 dark:border-slate-500 dark:hover:bg-slate-800 dark:text-slate-300 text-slate-800 "
              onClick={() => {
                setShowTimeLeft(!showTimeLeft);
              }}>
              {!showTimeLeft
                ? `${formatTime(progress.current)} / ${formatTime(progress.duration)}`
                : `${formatTime(progress.duration - progress.current)}`}
            </button>
          </div>
          {/* bottom rhs buttons */}
          <div className="flex space-x-0">
            <button
              className={`pl-6 relative overflow-hidden flex items-center justify-center w-auto min-w-fit h-11 hover:bg-slate-700 dark:bg-slate-900  dark:hover:bg-slate-800 dark:text-slate-300  rounded-full ${
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
            {Object.keys(rhsButtons).map((key) => {
              return (
                <button
                  key={key}
                  className={rhsButtons[key].className}
                  onClick={rhsButtons[key].onClick}
                  disabled={rhsButtons[key].disabled}>
                  {rhsButtons[key].icon}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default DesktopControls;
