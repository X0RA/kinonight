import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { VideoJS } from "../components/videoPlayer";
import VideoOptionsPage from "../components/videoOptions";
import { processUrl } from "../components/helpers";

import { useAuth } from "../middleware/AuthContext";
import { useUserStatus } from "../middleware/StateContext";
import { uploadFile } from "../middleware/Storage";
import { set } from "@firebase/database";

import EmojiReactions from "../components/emojiReact";

function Room() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [cookies, setCookie] = useCookies(["room", "username"]);
  const [loading, setLoading] = useState(true);
  const { chosenRoom, setChosenRoom, videoInfo, videoOptions, setVideoOptions } = useUserStatus();
  const [userInteraction, setUserInteraction] = useState(false);

  const [doShowSidebar, setDoShowSidebar] = useState(false);

  // mouse stuff
  const [isCursorVisible, setIsCursorVisible] = useState(true);
  let mouseMoveTimeout;

  const handleMouseMove = () => {
    setIsCursorVisible(true);
    clearTimeout(mouseMoveTimeout);
    mouseMoveTimeout = setTimeout(() => {
      setIsCursorVisible(false);
    }, 3000);
  };

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      clearTimeout(mouseMoveTimeout);
    };
  }, []);

  // Redirects to the login page if the user is not logged in
  useEffect(() => {
    if (!currentUser) {
      setCookie("room", extractRoomNameFromURL(window.location.href), { path: "/", sameSite: "Strict" });
      navigate("/");
      return;
    }
    setCookieForCurrentUser(currentUser);
    setRoomFromURL();
  }, [currentUser, navigate, setCookie]);

  // Sets a cookie for the current user's username
  const setCookieForCurrentUser = (currentUser) => {
    const username = currentUser.email.split("@")[0];
    setCookie("username", username, { path: "/", sameSite: "Strict" });
  };

  // Extracts the room name from the URL and updates the chosenRoom state and cookie
  const setRoomFromURL = () => {
    const roomName = extractRoomNameFromURL(window.location.href);
    if (roomName) {
      setChosenRoom(roomName);
      setCookie("room", roomName, { path: "/", sameSite: "Strict" });
    }
  };

  // Helper function to extract room name from URL
  const extractRoomNameFromURL = (url) => {
    const urlRegEx = new RegExp("/Room/(.*)", "i");
    const urlMatch = urlRegEx.exec(url);
    return urlMatch && urlMatch[1] ? urlMatch[1] : null;
  };

  // Sets video options based on videoInfo
  useEffect(() => {
    if (videoInfo) {
      setVideo();
    }
  }, [videoInfo]);

  const setVideo = async () => {
    try {
      if (videoInfo && videoInfo.video_url) {
        await setVideoJSOptions(videoInfo);
      } else {
        setVideoOptions(null);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error setting video:", error);
      setLoading(false);
    }
  };

  // Configures video player options
  const setVideoJSOptions = async (options) => {
    let videoUrl = await processUrl(options.video_url);
    if (!videoUrl.status) {
      return;
    }

    const opts = createVideoOptions(videoUrl.url, options.subtitle_url);
    setVideoOptions(opts);
  };

  // Helper to create video player options
  const createVideoOptions = (videoUrl, subtitleUrl) => {
    const opts = {
      autoplay: true,
      controls: false,
      responsive: true,
      fluid: true,
      playsinline: true,
      sources: [{ src: videoUrl, type: "video/mp4" }],
    };

    if (subtitleUrl) {
      opts.tracks = [
        {
          kind: "captions",
          label: "English",
          src: subtitleUrl,
          srclang: "en",
          default: true,
        },
      ];
    }

    return opts;
  };

  if (videoOptions == null) {
    return <VideoOptionsPage />;
  } else {
    if (userInteraction == false) {
      return (
        <>
          <div className="flex flex-col items-center justify-center h-screen bg-primary-400">
            <div className="flex flex-col items-center justify-center w-1/2 h-1/2 bg-primary-200 rounded-lg">
              <h1 className="text-2xl font-bold">Welcome to the room!</h1>
              <p className="text-xl text-center pt-4 pb-4">
                This is a button so the browser is like "yeah he can load a video" or something idk.
              </p>
              <button onClick={() => setUserInteraction(true)} className="w-1/4 h-1/6 bg-primary-400 rounded-lg">
                Lets watch kino!
              </button>
            </div>
          </div>
        </>
      );
    } else {
      return (
        <div className={`${isCursorVisible ? "cursor-auto" : "cursor-none"}`}>
          <EmojiReactions />
          <VideoJS options={videoOptions} />
        </div>
      );
    }
  }
}

export default Room;
