import React from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import "tailwindcss/tailwind.css";
import "./VideoPlayer.css"; // Import the custom CSS file

export const VideoJS = (props) => {
  const videoRef = React.useRef(null);
  const playerRef = React.useRef(null);
  const { options, onReady } = props;

  React.useEffect(() => {
    if (!playerRef.current) {
      const videoElement = document.createElement("video-js");

      videoElement.classList.add(
        "vjs-big-play-centered",
        "rounded-lg",
        "shadow",
        "overflow-hidden",
        "vjs-custom-skin",
        "vjs-fill"
      );

      videoElement.style.width = "100%";
      videoElement.style.height = "100%";

      videoRef.current.appendChild(videoElement);

      const player = (playerRef.current = videojs(videoElement, options, () => {
        videojs.log("player is ready");
        onReady && onReady(player);
      }));
    } else {
      const player = playerRef.current;

      player.autoplay(options.autoplay);
      player.src(options.sources);
    }
  }, [options, videoRef]);

  React.useEffect(() => {
    const player = playerRef.current;

    return () => {
      if (player && !player.isDisposed()) {
        player.dispose();
        playerRef.current = null;
      }
    };
  }, [playerRef]);

  return (
    <div data-vjs-player className="mx-auto w-full h-full">
      <div ref={videoRef} className="w-full h-full" />
    </div>
  );
};

export default VideoJS;
