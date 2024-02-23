import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserStatus } from "../middleware/StateContext";
import { useAuth } from "../middleware/AuthContext";
import { processUrl } from "../components/helpers";
import { VideoJS } from "../components/videoPlayer";
import EmojiReactions from "../components/emojiOverlay";
import { useCookieManagement } from "../middleware/cookieManagement";

function Room() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { updateCookie, getCookie } = useCookieManagement();
  const [loading, setLoading] = useState(true);
  const {
    chosenRoom,
    setChosenRoom,
    connectedUsers,
    videoInfo,
    setVideoInfo,
    roomState,
    setRoomState,
    videoState,
    setVideoState,
    videoOptions,
    setVideoOptions,
    roomInfo,
    setRoomInfo,
  } = useUserStatus();
  const [userInteraction, setUserInteraction] = useState(false);

  // hide cursor when not in use when video is playing
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
    const roomName = extractRoomNameFromURL(window.location.href);
    if (!currentUser) {
      updateCookie("room", roomName);
      navigate("/");
      return;
    } else {
      if (!videoInfo) {
        navigate(`/room/${roomName}`);
      }
    }
    setCookieForCurrentUser(currentUser);
    setRoomFromURL();
  }, [currentUser, navigate, videoInfo]);

  // Sets a cookie for the current user's username
  const setCookieForCurrentUser = (currentUser) => {
    const username = currentUser.email.split("@")[0];
    updateCookie("username", username);
  };

  // Extracts the room name from the URL and updates the chosenRoom state and cookie
  const setRoomFromURL = () => {
    const roomName = extractRoomNameFromURL(window.location.href);
    if (roomName) {
      setChosenRoom(roomName);
      updateCookie("room", roomName);
    }
  };

  // Helper function to extract room name from URL
  const extractRoomNameFromURL = (url) => {
    const parts = url.split("/");
    const roomIndex = parts.findIndex((part) => part.toLowerCase() === "room");
    return roomIndex !== -1 && parts[roomIndex + 1] ? parts[roomIndex + 1] : null;
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

    const opts = createVideoOptions(options.hls ? videoUrl.hls_url : videoUrl.url, options.subtitle_url, options.hls);
    setVideoOptions(opts);
  };

  // Helper to create video player options
  const createVideoOptions = (videoUrl, subtitleUrl, hls) => {
    const opts = {
      autoplay: true,
      controls: false,
      responsive: true,
      fluid: true,
      playsinline: true,
      sources: [{ src: videoUrl, type: hls ? "application/x-mpegURL" : "video/mp4" }],
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    );
  }

  if (!userInteraction) {
    return (
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
    );
  }

  // If none of the above conditions are met, render the video player
  return (
    <div className={`${isCursorVisible ? "cursor-auto" : "cursor-none"} bg-black`}>
      <EmojiReactions />
      <VideoJS options={videoOptions} />
    </div>
  );
}

export default Room;
