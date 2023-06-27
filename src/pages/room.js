import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { VideoJS } from "../components/videoPlayer";
import VideoOptionsPage from "../components/videoOptions";
import { processUrl } from "../components/helpers";
import BubblePopper from "../components/bubblePopper";

import { useAuth } from "../middleware/AuthContext";
import { useUserStatus } from "../middleware/StateContext";

function Room() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  // const [videoOptions, setVideoOptions] = useState(null);
  const [cookies, setCookie] = useCookies(["room", "username"]);
  const [loading, setLoading] = useState(true);
  const { chosenRoom, setChosenRoom, roomInfo, videoOptions, setVideoOptions } = useUserStatus();
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

  const setVideoJSOptions = async (options) => {
    let videoUrl = await processUrl(options.video_url);
    console.log(videoUrl);
    // if video url is still valid then set the options else stop this process
    if (!videoUrl.status) {
      return;
    }

    //set the options
    var opts = {
      autoplay: true,
      controls: false,
      responsive: true,
      fluid: true,
      playsinline: true,
      sources: [
        {
          src: videoUrl.url,
          type: "video/mp4",
        },
      ],
    };

    if (options.subtitle_url) {
      opts.tracks = [
        {
          kind: "captions",
          label: "English",
          src: options.subtitle_url,
          srclang: "en",
          default: true,
        },
      ];
    }

    setVideoOptions(opts);
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
      return (
        <>
          {/* {roomInfo && roomInfo.video_info && <SideInfo videoInfo={roomInfo} />} */}
          <VideoJS options={videoOptions} />
        </>
      );
    }
  }
}

export default Room;
