import { useState } from "react";
import { inputWithButton } from "../components/customComponents";
import React from "react";
import VideoPlayer from "../components/videoPlayer";

function Convert() {
  const [originalText, setOriginalText] = useState("");
  const [displayText, setDisplayText] = useState("");

  const playerRef = React.useRef(null);

  const videoJsOptions = {
    autoplay: true,
    controls: true,
    responsive: true,
    fluid: true,
    sources: [
      {
        src: "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_5MB.mp4",
        type: "video/mp4",
      },
    ],
  };

  const handlePlayerReady = (player) => {
    playerRef.current = player;

    // You can handle player events here, for example:
    player.on("waiting", () => {
      VideoPlayer.log("player is waiting");
    });

    player.on("dispose", () => {
      VideoPlayer.log("player will dispose");
    });
  };

  const handleButtonClick = () => {
    processUrl(displayText).then((result) => {
      console.log(result);
    });
  };

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
    return jsonData.parent.stream_url;
  };

  return (
    <div className="flex justify-center items-center h-screen bg-primary-400">
      <div className="grid grid-cols-3 gap-4 bg-primary-300">
        <div className="col-span-1 col-start-2 bg-secondary-400 flex items-center">
          <h1>Kino Night</h1>
        </div>
        <div className="col-span-1 col-start-2 bg-secondary-400 flex items-center">{inputWithButton()}</div>
        <div className="col-span-1 col-start-2 bg-secondary-400 flex items-center">{inputWithButton()}</div>
        <div className="col-span-1 col-start-1 bg-primary-800">
          <div className="h-10"></div>
        </div>
        <div className="col-span-2 bg-primary-800">
          <VideoPlayer options={videoJsOptions} onReady={handlePlayerReady}></VideoPlayer>
        </div>
      </div>
    </div>
  );
}

export default Convert;
