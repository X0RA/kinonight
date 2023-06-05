import { useCookies } from "react-cookie";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../middleware/AuthContext";
import auth from "../middleware/Firebase";

import { Fragment } from "react";
import { Transition } from "@headlessui/react";

function Index() {
  const [cookies, setCookie] = useCookies(["room", "username"]);
  const [room, setRoom] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { currentUser, loginOrSignUp, logout } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleJoin = async () => {
    if (!currentUser) {
      let res = await loginOrSignUp(username + "@kinonight.web.app", password);
      if (res.status) {
        if (room && room.trim() !== "") {
          navigate("/room/" + room);
        } else {
          setError(["Enter a proper room name", ...error]);
        }
      } else {
        // Handle login or registration error
        setError([res.message, ...error]);
      }
    }
    if (currentUser) {
      if (room && room.trim() !== "") {
        navigate("/room/" + room);
      } else {
        setError(["Enter a proper room name", ...error]);
      }
    }
  };

  useEffect(() => {
    if (error) {
      setTimeout(() => {
        setError("");
      }, 3000);
    }
  }, [error]);

  useEffect(() => {
    if (cookies.room) {
      setRoom(cookies.room);
    }
    if (cookies.username) {
      setUsername(cookies.username);
    }
  }, []);

  return (
    <div className="flex flex-col justify-start items-center h-screen bg-primary-400 space-y-8 pt-20">
      <h1 className="text-5xl font-bold text-white">Kino Night</h1>
      <div className="grid grid-cols-2 gap-4 w-64"></div>
      <div className="grid grid-cols-2 gap-4 w-64"></div>
      <div className="grid grid-cols-4 gap-4 sm:w-5/12 w-full p-5 sm:p-0">
        {/* conditional if logged in */}
        {!currentUser ? (
          <>
            {/* username */}
            <div className="col-span-2">
              <h2 className="text-xl text-white">Username</h2>
              <input
                className="mt-2 p-2 rounded-lg w-full bg-white"
                value={username}
                onChange={(e) => {
                  const val = e.target.value;
                  const reg = /^[A-Za-z_]*$/;
                  if (reg.test(val)) {
                    setUsername(val);
                  }
                }}
                type="text"
                placeholder="Enter username"
              />
            </div>

            {/* password */}
            <div className="col-span-2">
              <h2 className="text-xl text-white">Password</h2>
              <input
                className="mt-2 p-2 rounded-lg w-full bg-white"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="Enter password"
              />
            </div>
          </>
        ) : (
          <>
            <div className="col-span-4 text-white text-center w-full">Logged in as {currentUser.email}</div>
          </>
        )}

        {/* room */}
        <div className="col-span-4">
          <h2 className="text-xl text-white">Room name</h2>
          <input
            className="mt-2 p-2 rounded-lg w-full bg-white"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
            type="text"
            placeholder="Enter room name"
          />
        </div>
        {/* jon button */}
        <div className={currentUser ? "col-span-3" : "col-span-4"}>
          <button className="mt-2 p-2 rounded-lg bg-white w-full text-primary-400 font-bold" onClick={handleJoin}>
            Join
          </button>
        </div>
        {/* logout button */}
        <div className={currentUser ? "col-span-1" : "hidden"}>
          <button
            className="mt-2 p-2 rounded-lg bg-white w-full text-primary-400 font-bold"
            onClick={() => {
              logout();
            }}>
            Logout
          </button>
        </div>
      </div>
      {error && (
        <Transition
          show={true}
          enter="transition ease-out duration-300"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="transition ease-in duration-200"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95">
          <div className=" rounded-lg fixed top-0 right-0 m-4 pointer-events-none bg-primary-900">
            <div className="max-w-sm w-full bg-red-500 rounded-lg shadow-lg pointer-events-auto">
              <div className="p-4">
                {error.map((errorMessage, index) => (
                  <Fragment key={index}>
                    <div className="mb-2 ">
                      <p className="text-white text-sm">{errorMessage}</p>
                    </div>
                  </Fragment>
                ))}
              </div>
            </div>
          </div>
        </Transition>
      )}
    </div>
  );
}

export default Index;
