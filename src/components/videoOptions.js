import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserStatus } from "../middleware/StateContext";
// import { setRoomInfo } from "../middleware/DatabaseContext";

export default function VideoOptionsPage(props) {
  const { setChosenRoom, connectedUsers, setRoomInfo, setRoomState } = useUserStatus();
  const [newInfo, setNewInfo] = useState({
    video_name: "",
    video_url: "",
    subtitle_url: "",
    room_password: "", // Add your input for password
  });
  const [searchSubtitle, setSearchSubtitle] = useState("");
  const { roomName } = props;
  const Navigate = useNavigate();

  const handleInputChange = (e) => {
    setNewInfo({
      ...newInfo,
      [e.target.name]: e.target.value,
    });
  };

  const leaveLobby = () => {
    setChosenRoom(null);
    Navigate("/");
  };

  const handleUpdate = () => {
    setRoomInfo(newInfo);
    setRoomState({
      is_playing: false,
      last_update_time: Date.now(),
      video_length: 0,
      video_position: 0,
    });
  };

  return (
    <div className="flex flex-col justify-start items-center h-screen bg-primary-400 space-y-8 pt-20">
      <h1 className="text-5xl font-bold text-white">Kino Night</h1>
      <h2 className="text-2xl font-bold text-white">{roomName}</h2>
      <h2 className="text-2xl font-bold text-white">
        Connected Users:{" "}
        {connectedUsers.map((user, index) => {
          return <span key={index}>{user}, </span>;
        })}
      </h2>
      <div className="grid grid-cols-2 gap-4 w-64"></div>
      <div className="grid grid-cols-2 gap-4 w-64"></div>
      {/* content */}
      <div className="grid grid-cols-4 gap-4 sm:w-5/12 w-full p-5 sm:p-0">
        {/* vid url */}
        <div className="col-span-2">
          <h2 className="text-xl text-white">Video URL:</h2>
          <input
            className="mt-2 p-2 rounded-lg w-full bg-white"
            name="video_url"
            value={newInfo.video_url}
            onChange={handleInputChange}
            type="text"
            placeholder="Enter video URL"
          />
        </div>
        {/* sub url */}
        <div className="col-span-2">
          <h2 className="text-xl text-white">Subtitle URL:</h2>
          <div className="relative">
            <input
              className="mt-2 p-2 rounded-lg w-full bg-whi"
              name="subtitle_url"
              value={newInfo.subtitle_url}
              onChange={handleInputChange}
              type="text"
              placeholder="Enter file URL"
              id="file_input_text"
            />
            <label
              htmlFor="file_input"
              className="border border-primary-300 absolute right-2.5 bottom-1 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm text-black px-2 py-1 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 cursor-pointer">
              Or Upload
            </label>
            <input className="hidden" id="file_input" type="file" />
          </div>
        </div>
        {/* search subtitle */}
        <div className="col-span-2">
          <h2 className="text-xl text-white">Search Subtitle:</h2>
          <input
            className="mt-2 p-2 rounded-lg w-full bg-white"
            value={searchSubtitle}
            onChange={(e) => setSearchSubtitle(e.target.value)}
            type="text"
            placeholder="Enter subtitle search term"
          />
        </div>
        {/* movie name */}
        <div className="col-span-2">
          <h2 className="text-xl text-white">Movie Name:</h2>
          <input
            className="mt-2 p-2 rounded-lg w-full bg-white"
            name="video_name"
            value={newInfo.video_name}
            onChange={handleInputChange}
            type="text"
            placeholder="Enter movie name"
          />
        </div>
        {/* button layer */}
        <button
          className="col-span-3 mt-2 p-2 rounded-lg bg-white w-full text-primary-400 font-bold"
          onClick={handleUpdate}>
          Join
        </button>
        <button
          className="col-span-1 mt-2 p-2 rounded-lg bg-white w-full text-primary-400 font-bold"
          onClick={leaveLobby}>
          Leave
        </button>
      </div>
    </div>
  );
}
