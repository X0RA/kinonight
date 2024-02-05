// import MobileControls from "./mobileControls";

// const Temp = () => {
//   return (
//       <MobileControls />
//   );
// };

// export default Temp;
// bottom-0 opacity-0 hover:opacity-100 transition-opacity duration-200
import React, { useState, useEffect, useRef } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";

function Temp() {
  const videoRef = useRef(null);
  const [audioTrackIndex, setAudioTrackIndex] = useState(0); // Track the current audio track index

  useEffect(() => {
    const player = videojs(videoRef.current, {
      techOrder: ["html5"],
      sources: [
        {
          src: "https://api.put.io/v2/files/1316149227/hls/media.m3u8?oauth_token=2RB4XYV7IK54HDGTS2KH&subtitle_languages=eng&original=0",
          type: "application/x-mpegURL",
        },
      ],
    });

    player.ready(function () {
      // Add custom button for audio track switching
      const button = player.controlBar.addChild("button");
      button.addClass("vjs-icon-audio");
      button.el().innerText = "Switch Audio";
      button.on("click", function () {
        switchAudioTrack(player);
      });

      // Log audio tracks here
      const tracks = player.audioTracks();
      console.log(tracks);
      for (let i = 0; i < tracks.length; i++) {
        console.log(`Track ${i}:`, tracks[i].label);
      }
    });

    return () => {
      if (player) {
        player.dispose();
      }
    };
  }, []);

  // Function to switch audio tracks
  const switchAudioTrack = (player) => {
    const tracks = player.audioTracks();
    if (tracks && tracks.length > 1) {
      const currentTrackIndex = audioTrackIndex;
      const nextTrackIndex = (currentTrackIndex + 1) % tracks.length;
      tracks[currentTrackIndex].enabled = false;
      tracks[nextTrackIndex].enabled = true;
      setAudioTrackIndex(nextTrackIndex); // Update the state to reflect the new track index
    }
  };

  return (
    <div data-vjs-player>
      <video ref={videoRef} className="video-js vjs-default-skin" controls />
    </div>
  );
}

export default Temp;
