import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserStatus } from "../middleware/StateContext";
import { useAuth } from "../middleware/AuthContext";
import { useCookieManagement } from "../middleware/cookieManagement";

function RoomInfo() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { updateCookie } = useCookieManagement();
  const { chosenRoom, setChosenRoom, connectedUsers, videoInfo, setVideoInfo } = useUserStatus();

  useEffect(() => {
    const roomName = new URL(window.location.href).hash
      .split("/")
      .find((part, i, arr) => arr[i - 1]?.toLowerCase() === "room");
    if (!currentUser) {
      updateCookie("room", roomName || "");
      navigate("/");
    } else if (roomName) {
      setChosenRoom(roomName);
      updateCookie("room", roomName);
    }
  }, [currentUser, navigate, updateCookie, setChosenRoom, videoInfo]);

  if (!videoInfo) return <LoadingState />;

  return Object.keys(videoInfo).length === 0 || videoInfo.video_url === "" ? (
    <NoRoomInfo />
  ) : (
    <RoomInfoDisplay
      videoInfo={videoInfo}
      chosenRoom={chosenRoom}
      connectedUsers={connectedUsers}
      clearRoom={() => setVideoInfo({ subtitle_url: "", video_name: "", video_url: "", hls: false })}
    />
  );
}

function LoadingState() {
  return (
    <div className="flex flex-col justify-start items-center h-screen bg-primary-400 space-y-8 pt-20">
      <p>Loading room information...</p>
    </div>
  );
}

function NoRoomInfo() {
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-primary-400 space-y-4 pt-10">
      <p className="text-sm text-white font-medium">There is no room info, go back to /room and enter some</p>
    </div>
  );
}

function RoomInfoDisplay({ videoInfo, chosenRoom, connectedUsers, clearRoom }) {
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-primary-400 space-y-4 pt-10">
      <h1 className="text-4xl font-bold text-white">Kino Night</h1>
      <h4 className="text-lg font-semibold text-white">Room: {chosenRoom}</h4>
      <ConnectedUsersDisplay connectedUsers={connectedUsers} />
      <div className="space-y-2">
        {Object.entries(videoInfo).map(([key, value]) => (
          <div key={key} className="text-sm text-white">
            <strong>{key}:</strong> <span className="font-light">{JSON.stringify(value)}</span>
          </div>
        ))}
      </div>
      <button className="bg-red-400 rounded-2xl p-2" onClick={clearRoom}>
        Clear room
      </button>
    </div>
  );
}

function ConnectedUsersDisplay({ connectedUsers }) {
  return <h2 className="text-2xl font-bold text-white">Connected Users: {connectedUsers.join(", ")}</h2>;
}

export default RoomInfo;
