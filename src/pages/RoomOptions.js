import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserStatus } from "../middleware/StateContext";
import { useAuth } from "../middleware/AuthContext";
import { processUrl } from "../components/helpers";
import { useCookieManagement } from "../middleware/cookieManagement";
import { uploadFile } from "../middleware/Storage";

function RoomOptions() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { updateCookie, getCookie } = useCookieManagement();
  // Correctly combine the destructured values into one statement
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
    roomInfo,
    setRoomInfo,
  } = useUserStatus();
  // const [loading, setLoading] = useState(false);
  const [newInfo, setNewInfo] = useState({ video_url: "", subtitle_url: "", hls: false });
  const [file, setFile] = useState(null);
  const [hover, setHover] = useState(false);
  const [ShowOptions, setShowOptions] = useState(false);

  useEffect(() => {
    const extractRoomNameFromURL = (url) => {
      const parts = url.split("/");
      const roomIndex = parts.findIndex((part) => part.toLowerCase() === "room");
      return roomIndex !== -1 && parts[roomIndex + 1] ? parts[roomIndex + 1] : null;
    };

    const handleUserState = () => {
      const roomName = extractRoomNameFromURL(window.location.href);
      if (!currentUser) {
        updateCookie("room", roomName);
        navigate("/");
      } else {
        if (roomName) {
          setChosenRoom(roomName);
          updateCookie("room", roomName);
        } else {
          navigate(`/`);
        }
        if (videoInfo) {
          if (videoInfo.video_url) {
            navigate(`/room/${roomName}/watch`);
          }
        }
      }
    };
    handleUserState();
  }, [currentUser, navigate, updateCookie, setChosenRoom, videoInfo]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const removeUpload = () => {
    setFile(null);
    setHover(false);
  };

  const leaveLobby = () => {
    setChosenRoom(null);
    navigate("/");
  };

  // New function to handle subtitle file upload
  const uploadSubtitleFile = async (file) => {
    try {
      const path = `subtitles/${file.name}`; // Define the path where the file will be stored
      const url = await uploadFile(path, file); // Upload the file
      return { url };
    } catch (error) {
      return { error };
    }
  };

  const handleJoin = async () => {
    let updatedInfo = { ...newInfo };

    if (updatedInfo.video_url) {
      let validFile = await processUrl(updatedInfo.video_url);
      // hls stuff here
      if (!validFile.status) {
        alert("Invalid URL");
        return;
      }
    }

    if (file) {
      const uploadResult = await uploadSubtitleFile(file);
      if (uploadResult.error) {
        console.error("Failed to upload file:", uploadResult.error);
        return;
      }
      updatedInfo.subtitle_url = uploadResult.url;
    }

    setNewInfo(updatedInfo);
    setVideoInfo(updatedInfo);
    setVideoState({
      is_playing: false,
      last_update_time: Date.now(),
      video_length: 0,
      video_position: 0,
    });
  };

  if (!videoInfo) {
    return <LoadingDisplay />;
  }

  if ((videoInfo !== null && Object.keys(videoInfo).length === 0) || videoInfo.video_url === "") {
    return (
      <div className="flex flex-col justify-start items-center h-screen bg-primary-400 space-y-8 pt-20">
        {/* add a settings button in the top right */}
        <Settings></Settings>
        {/* normal buttons */}
        <h1 className="text-5xl font-bold text-white">Kino Night</h1>
        <h4 className="text-1xl font-bold text-white"> Room: {chosenRoom}</h4>
        <ConnectedUsersDisplay connectedUsers={connectedUsers} />

        {/* Form for setting video and subtitle URLs */}
        <div className="grid grid-cols-4 gap-4 sm:w-5/12 w-full p-5 sm:p-0">
          <VideoURLInput value={newInfo.video_url} onChange={handleInputChange} />
          <SubtitleInput
            file={file}
            hover={hover}
            setHover={setHover}
            removeUpload={removeUpload}
            value={newInfo.subtitle_url}
            onChange={handleInputChange}
            onFileChange={handleFileChange}
          />
          <UpdateButtons onJoin={handleJoin} onLeave={leaveLobby} />
        </div>
      </div>
    );
  }

  function Settings() {
    return (
      <div className="absolute top-5 right-5">
        <button
          className="p-2 rounded-lg bg-white text-primary-400 font-bold"
          onClick={() => setShowOptions(!ShowOptions)}>
          Settings
        </button>
        <div className={`${ShowOptions ? "block" : "hidden"} absolute top-10 right-0`}>
          <input
            type="checkbox"
            id="hls"
            name="hls"
            checked={newInfo.hls}
            onChange={() => setNewInfo({ ...newInfo, hls: !newInfo.hls })}
          />
          <label htmlFor="hls" className="text-white">
            Force HLS
          </label>
        </div>
      </div>
    );
  }

  function LoadingDisplay() {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    );
  }

  // Component to display connected users
  function ConnectedUsersDisplay({ connectedUsers }) {
    return (
      <h2 className="text-2xl font-bold text-white">
        Connected Users:{" "}
        {connectedUsers.map((user, index) => (
          <span key={index}>
            {user}
            {index !== connectedUsers.length - 1 ? ", " : ""}
          </span>
        ))}
      </h2>
    );
  }

  // Input for video URL
  function VideoURLInput({ value, onChange }) {
    return (
      <div className="col-span-2">
        <h2 className="text-xl text-white">Video URL:</h2>
        <input
          className="mt-2 p-2 rounded-lg w-full bg-white"
          name="video_url"
          value={value}
          onChange={onChange}
          type="text"
          placeholder="Enter video URL"
        />
      </div>
    );
  }

  // Input for subtitle URL and file upload
  function SubtitleInput({ file, hover, setHover, removeUpload, value, onChange, onFileChange }) {
    return (
      <div className="col-span-2">
        <h2 className="text-xl text-white">
          Subtitle:{" "}
          {file && (
            <span
              className="overflow-hidden overflow-ellipsis"
              onMouseEnter={() => setHover(true)}
              onMouseLeave={() => setHover(false)}
              onClick={removeUpload}>
              {hover ? "remove" : file.name.length > 9 ? `${file.name.substring(0, 11)}...` : file.name}
            </span>
          )}
        </h2>
        <div className="relative">
          <input
            className="mt-2 p-2 rounded-lg w-full bg-white"
            name="subtitle_url"
            value={value}
            onChange={onChange}
            type="text"
            placeholder="Enter URL"
            id="file_input_text"
          />
          <input className="hidden" id="file_input" type="file" onChange={onFileChange} />
          <label
            htmlFor="file_input"
            className="border border-primary-300 absolute right-2.5 bottom-1 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm text-black px-2 py-1 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 cursor-pointer">
            Or Upload
          </label>
        </div>
      </div>
    );
  }

  // Buttons for updating room info and leaving the lobby
  function UpdateButtons({ onJoin, onLeave }) {
    return (
      <>
        <button className="col-span-3 mt-2 p-2 rounded-lg bg-white w-full text-primary-400 font-bold" onClick={onJoin}>
          Join
        </button>
        <button className="col-span-1 mt-2 p-2 rounded-lg bg-white w-full text-primary-400 font-bold" onClick={onLeave}>
          Leave
        </button>
      </>
    );
  }
}

export default RoomOptions;
