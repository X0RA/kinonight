import { useCookies } from "react-cookie";

import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";

function Index() {
  const [cookies, setCookie] = useCookies(["room", "username"]);
  const [room, setRoom] = useState("");
  const [username, setUsername] = useState("");

  const handleJoin = async () => {
    setCookie("room", room, { path: "/" });
    setCookie("username", username, { path: "/" });
  };

  useEffect(() => {
    if (cookies.room) {
      setRoom(cookies.room);
    }
    if (cookies.username) {
      setUsername(cookies.username);
    }
  }, []);

  if (cookies.room && cookies.username) {
    return <Navigate to={"/room/" + cookies.room} />;
  } else {
    return (
      <div className="flex flex-col justify-start items-center h-screen bg-primary-400 space-y-8 pt-20">
        <h1 className="text-5xl font-bold text-white">Kino Night</h1>
        <div className="grid grid-cols-2 gap-4 w-64"></div>
        <div className="grid grid-cols-2 gap-4 w-64"></div>
        <div className="grid grid-cols-2 gap-4 sm:w-5/12 w-full p-5 sm:p-0">
          <div>
            <h2 className="text-xl text-white">Username</h2>
            <input
              className="mt-2 p-2 rounded-lg w-full bg-white"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              type="text"
              placeholder="Enter username"
            />
          </div>
          <div>
            <h2 className="text-xl text-white">Room name</h2>
            <input
              className="mt-2 p-2 rounded-lg w-full bg-white"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              type="text"
              placeholder="Enter room name"
            />
          </div>
          <div className="col-span-2">
            <button className="mt-2 p-2 rounded-lg bg-white w-full text-primary-400 font-bold" onClick={handleJoin}>
              Join
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default Index;
