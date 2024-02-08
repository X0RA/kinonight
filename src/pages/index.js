import { useCookies } from "react-cookie";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../middleware/AuthContext";

import { Fragment } from "react";
import { Transition } from "@headlessui/react";

function Index() {
  const [cookies, setCookie] = useCookies(["room", "accountName", "password", "displayName"]);
  const [accountName, setAccountName] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [room, setRoom] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { currentUser, loginOrSignUp, setUsername } = useAuth();

  const handleJoin = async () => {
    if (!currentUser) {
      let res = await loginOrSignUp(accountName + "@xkiinonight.web.app", password);
      if (res.status) {
        await setUsername(displayName);
        if (room && room.trim() !== "") {
          setCookie("accountName", accountName, { path: "/", sameSite: "Strict" });
          setCookie("password", password, { path: "/", sameSite: "Strict" });
          setCookie("displayName", displayName, { path: "/", sameSite: "Strict" });
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
      if (currentUser.displayName !== displayName) {
        await setUsername(displayName);
      }
      setCookie("displayName", displayName, { path: "/", sameSite: "Strict" });
      if (room && room.trim() !== "") {
        navigate("/room/" + room);
      } else {
        setError(["Enter a proper room name", ...error]);
      }
    }
  };

  function generateRandomString(length) {
    let result = "";
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  useEffect(() => {
    setAccountName(generateRandomString(10));
    setPassword(generateRandomString(10));
  }, []);

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
    if (cookies.accountName) {
      setAccountName(cookies.accountName);
    }
    if (cookies.displayName) {
      setDisplayName(cookies.displayName);
    }
    if (cookies.password) {
      setPassword(cookies.password);
    }
  }, []);

  return (
    <div className="flex flex-col justify-start items-center h-screen bg-primary-400 space-y-8 pt-20">
      {/* <button className="absolute top-0 right-0 m-4" onClick={() => navigate("/test")}>
        TEST
      </button> */}
      <h1 className="text-5xl font-bold text-white">Kino Night</h1>
      <div className="grid grid-cols-2 gap-4 w-64"></div>
      <div className="grid grid-cols-2 gap-4 w-64"></div>
      <div className="grid grid-cols-4 gap-4 sm:w-5/12 w-full p-5 sm:p-0">
        {/* conditional if logged in */}
        {currentUser && (
          <>
            <div className="col-span-4 text-white text-center w-full">Logged in as {currentUser.displayName}</div>
          </>
        )}

        {/* Username */}
        <div className="col-span-2">
          <h2 className="text-xl text-white">Username</h2>
          <input
            className="mt-2 p-2 rounded-lg w-full bg-white"
            value={displayName}
            onChange={(e) => {
              const val = e.target.value;
              const reg = /^[A-Za-z0-9_ ]*$/;

              if (reg.test(val)) {
                setDisplayName(val);
              }
            }}
            type="text"
            placeholder="Enter Username"
          />
        </div>

        {/* room */}
        <div className="col-span-2">
          <h2 className="text-xl text-white">Room name</h2>
          <input
            className="mt-2 p-2 rounded-lg w-full bg-white"
            value={room}
            onChange={(e) => setRoom(e.target.value.toLowerCase())}
            type="text"
            placeholder="Enter room name"
          />
        </div>
        {/* join button */}
        <div className={currentUser ? "col-span-4" : "col-span-4"}>
          <button className="mt-2 p-2 rounded-lg bg-white w-full text-primary-400 font-bold" onClick={handleJoin}>
            Join
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
