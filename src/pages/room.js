import { VideoJS } from "../components/videoPlayer";
import React, { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import VideoOptionsPage from "../components/videoOptions";

function Room() {
  const [cookies, setCookie] = useCookies(["room", "username"]);
  const [room, setRoom] = useState("");
  const [username, setUsername] = useState("");

  const [videoOptions, setVideoOptions] = useState(null);

  useEffect(() => {
    if (cookies.room) {
      setRoom(cookies.room);
    } else {
      // get room name from url
      var urlRegEx = new RegExp("^.*/Room/(.*)", "i");
      var urlMatch = urlRegEx.exec(window.location.href);
      if (urlMatch && urlMatch[1]) {
        setRoom(urlMatch[1]);
      }
    }
    if (cookies.username) {
      setUsername(cookies.username);
    }
  }, []);

  const processUrl = async (url) => {
    var urlRegEx = new RegExp("^https://app.put.io/a-gift-from/(.*)/(.*)", "i");
    var urlMatch = urlRegEx.exec(url);
    if (urlMatch && urlMatch[2]) {
      return await getPutIOVideoUrl(urlMatch[2]);
    } else {
      return url;
    }
  };

  const getPutIOVideoUrl = async (oauthToken) => {
    var apiUrl =
      "https://api.put.io/v2/files/public?codecs_parent=1&media_info_parent=1&mp4_status_parent=1&mp4_stream_url_parent=1&oauth_token=" +
      oauthToken +
      "&stream_url_parent=1&video_metadata_parent=1";
    var apiResponse = await fetch(apiUrl);
    var jsonData = await apiResponse.json();

    return jsonData.parent.mp4_stream_url;
  };

  const createVideoOptions = async (options) => {
    console.log(options);
    if (options.url) {
      let uurl = await processUrl(options.url);
      options.url = uurl;
    }
    setVideoOptions({
      autoplay: true,
      controls: false,
      responsive: true,
      fluid: true,
      sources: [
        {
          src: options.url ? options.url : "/test.mp4",
          type: "video/mp4",
        },
      ],
    });
  };

  if (videoOptions) {
    return (
      <div>
        <VideoJS options={videoOptions} clearVideo={setVideoOptions} />
      </div>
    );
  } else {
    return <VideoOptionsPage setVideoOptions={createVideoOptions} roomName={room} />;
  }
}

export default Room;
