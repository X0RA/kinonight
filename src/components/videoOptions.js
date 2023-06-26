import { update } from "firebase/database";
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useUserStatus } from "../middleware/StateContext";
import { uploadFile } from "../middleware/Storage";
import { processUrl } from "./helpers";

// Utility function to delay function calls
const debounce = (func, delay) => {
  let debounceTimer;
  return function () {
    const context = this;
    const args = arguments;
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => func.apply(context, args), delay);
  };
};

export default function VideoOptionsPage(props) {
  // User status and navigation setup
  const { setChosenRoom, connectedUsers, setRoomInfo, setRoomState } = useUserStatus();
  const Navigate = useNavigate();
  const { roomName } = props;

  // State variables
  const [newInfo, setNewInfo] = useState({
    video_name: "",
    video_info: {},
    video_url: "",
    subtitle_url: "",
    room_password: "",
  });

  const [hover, setHover] = useState(false);
  const removeUpload = () => {
    setFile(null);
    setHover(false);
  };

  const [movieTitle, setMovieTitle] = useState("");
  const [movieResults, setMovieResults] = useState([]);
  const [movieResultsSelected, setMovieResultsSelected] = useState(false);
  const [file, setFile] = useState(null);

  // Function to handle file selection
  const handleFileChange = (e) => {
    console.log(e.target.files[0]);
    setFile(e.target.files[0]);
  };

  // Function to handle input field changes
  const handleInputChange = (e) => {
    setNewInfo({
      ...newInfo,
      [e.target.name]: e.target.value,
    });
    console.log(newInfo);
  };

  // Function to leave the lobby
  const leaveLobby = () => {
    setChosenRoom(null);
    Navigate("/");
  };

  // Function to search for a movie
  const searchMovie = async (title) => {
    const url = `https://movie-api.duckdns.org:3005/search?title=${encodeURIComponent(title)}`;

    try {
      const response = await fetch(url, { mode: "cors" });
      if (!response.ok) {
        throw new Error("Failed to fetch movie data");
      }
      const data = await response.json();
      console.log(data);
      if (data !== "No movies found") {
        setMovieResults(data);
      } else {
        setMovieResults([]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Function to debounce the movie search, using useCallback to ensure function isn't recreated on each render
  const searchMovieDebounced = useCallback(
    debounce((title) => searchMovie(title), 300),
    []
  );
  // Function to update room info, including file upload
  const handleUpdate = async () => {
    let updatedInfo = { ...newInfo };

    console.log(updatedInfo);

    if (updatedInfo.video_url) {
      let validFile = await processUrl(updatedInfo.video_url);
      // if validFile.status is true then  continue else return
      if (!validFile.status) {
        alert("Invalid URL");
        return;
      }
    }

    if (file) {
      try {
        const formData = new FormData();
        formData.append("file", file);

        // Fetch request to the server
        const response = await fetch(
          "https://movie-api.duckdns.org:3005/subtitles/upload",
          {
            method: "POST",
            body: formData,
          },
          { mode: "cors" }
        );

        if (response.ok) {
          // Get the response data (URL)
          const url = await response.text();
          console.log("Uploaded file URL:", url);

          // Update the subtitle URL
          updatedInfo.subtitle_url = url;
        } else {
          console.error("Failed to upload file:", response.statusText);
          return;
        }
      } catch (error) {
        console.error("Error while uploading file: ", error);
        return;
      }
    }

    console.log(updatedInfo);

    setNewInfo(updatedInfo);
    setRoomInfo(updatedInfo);
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
          return (
            <span key={index}>
              {user}
              {index !== connectedUsers.length - 1 ? ", " : ""}
            </span>
          );
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
              className="mt-2 p-2 rounded-lg w-full bg-whi"
              name="subtitle_url"
              value={newInfo.subtitle_url}
              onChange={handleInputChange}
              type="text"
              placeholder="Enter URL"
              id="file_input_text"
            />
            {/* upload */}
            <input className="hidden" id="file_input" type="file" onChange={handleFileChange} />
            <label
              htmlFor="file_input"
              className="border border-primary-300 absolute right-2.5 bottom-1 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm text-black px-2 py-1 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 cursor-pointer">
              Or Upload
            </label>
          </div>
        </div>

        {/* movie name */}
        <div className="col-span-4">
          <h2 className="text-xl text-white">Search for movie:</h2>
          <div className="relative">
            <input
              type="search"
              className="w-full mt-2 p-2 rounded-lg bg-white"
              name="video_name"
              value={movieTitle}
              onChange={(event) => {
                const newValue = event.target.value;
                setMovieTitle(newValue);
                searchMovieDebounced(newValue);
              }}
              onBlur={() => {
                setTimeout(() => {
                  setMovieResultsSelected(false);
                }, 200);
              }}
              onFocus={() => {
                setMovieResultsSelected(true);
              }}
              placeholder="Search"
            />
            {movieResultsSelected && movieResults && movieResults.length > 0 && (
              <div className="absolute z-10 w-full border divide-y shadow max-h-72 overflow-y-auto bg-white">
                {movieResults.map((result) => (
                  <div
                    key={result._id}
                    name="video_name"
                    className="block p-2 hover:bg-indigo-50"
                    onClick={() => {
                      setNewInfo({
                        ...newInfo,
                        video_name: result.title,
                        video_info: result,
                      });
                      setMovieTitle(result.title);
                    }}>
                    {result.title} - {result.year}
                  </div>
                ))}
              </div>
            )}
          </div>
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
