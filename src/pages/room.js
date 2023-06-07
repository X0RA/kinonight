import { VideoJS } from "../components/videoPlayer";
import React, { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import VideoOptionsPage from "../components/videoOptions";
import { useUserStatus } from "../middleware/StateContext";
import { processUrl } from "../components/helpers";
import { useAuth } from "../middleware/AuthContext";
import { useNavigate } from "react-router-dom";
import BubblePopper from "../components/bubblePopper";

function Room() {
  const navigate = useNavigate();
  const [videoOptions, setVideoOptions] = useState(null);
  const { currentUser } = useAuth();
  const [cookies, setCookie] = useCookies(["room", "username"]);
  const [loading, setLoading] = useState(true);
  const { chosenRoom, setChosenRoom, roomInfo } = useUserStatus();
  const [score, setScore] = useState(0);

  // Sets the chosenRoom and the username cookie
  // If the user is not logged in, redirect to the login page
  // This also needs to handle when the page is loaded straight to a room rather than after login
  useEffect(() => {
    if (currentUser) {
      setCookie("username", currentUser.email.split("@")[0], { path: "/" });

      var urlRegEx = new RegExp("^.*/Room/(.*)", "i");
      var urlMatch = urlRegEx.exec(window.location.href);
      if (urlMatch && urlMatch[1]) {
        setChosenRoom(urlMatch[1]);
        setCookie("room", urlMatch[1], { path: "/" });
      }
    } else {
      navigate("/");
    }
  }, [currentUser]);

  const setVideo = async () => {
    try {
      const roomInfoSnapshot = await roomInfo;
      if (roomInfoSnapshot && roomInfoSnapshot.video_url) {
        setVideoJSOptions(roomInfoSnapshot);
      } else {
        setVideoOptions(null);
      }
      setLoading(false); // End loading after the operation is done
    } catch (error) {
      console.error("Error setting video:", error);
      setLoading(false); // Ensure loading ends even if there is an error
    }
  };

  useEffect(() => {
    if (roomInfo) {
      setVideo();
    }
  }, [roomInfo]);

  const setVideoJSOptions = (options) => {
    setVideoOptions({
      autoplay: true,
      controls: false,
      responsive: true,
      fluid: true,
      playsinline: true,
      sources: [
        {
          src: "/test.mp4",
          type: "video/mp4",
        },
      ],
    });
  };

  if (loading || score <= 1) {
    return (
      <div>
        <BubblePopper score={score} setScore={setScore}></BubblePopper>
      </div>
    );
  } else {
    if (videoOptions == null) {
      return <VideoOptionsPage />;
    } else {
      return <VideoJS options={videoOptions} />;
    }
  }
}

export default Room;
