import React, { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import { VideoJS } from "./videoPlayer";
import { useNavigate } from "react-router-dom";

export default function VideoOptionsPage(props) {
  const [url, setUrl] = useState("");
  const [subUrl, setSubUrl] = useState("");
  // searchSubtitle
  const [searchSubtitle, setSearchSubtitle] = useState("");
  //movieName
  const [movieName, setMovieName] = useState("");
  const { setVideoOptions, roomName } = props;
  const Navigate = useNavigate();

  const logOut = () => {
    document.cookie = "room=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    Navigate("/");
  };

  return (
    <div className="flex flex-col justify-start items-center h-screen bg-primary-400 space-y-8 pt-20">
      <h1 className="text-5xl font-bold text-white">Kino Night</h1>
      <h2 className="text-2xl font-bold text-white">{roomName}</h2>
      <div className="grid grid-cols-2 gap-4 w-64"></div>
      <div className="grid grid-cols-2 gap-4 w-64"></div>
      {/* content */}
      <div className="grid grid-cols-4 gap-4 sm:w-5/12 w-full p-5 sm:p-0">
        {/* vid url */}
        <div className="col-span-2">
          <h2 className="text-xl text-white">Video URL:</h2>
          <input
            className="mt-2 p-2 rounded-lg w-full bg-white"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
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
              value={subUrl}
              onChange={(e) => setSubUrl(e.target.value)}
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
            value={movieName}
            onChange={(e) => setMovieName(e.target.value)}
            type="text"
            placeholder="Enter movie name"
          />
        </div>
        {/* button layer */}
        <button
          className="col-span-3 mt-2 p-2 rounded-lg bg-white w-full text-primary-400 font-bold"
          onClick={() => {
            setVideoOptions({ url, subUrl, searchSubtitle, movieName });
          }}>
          Join
        </button>
        <button className="col-span-1 mt-2 p-2 rounded-lg bg-white w-full text-primary-400 font-bold" onClick={logOut}>
          Leave
        </button>
      </div>
    </div>
  );
}
