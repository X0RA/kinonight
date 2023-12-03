import React, { useState, useEffect } from "react";
import anime from "animejs";
import { TiUser, TiVideo } from "react-icons/ti";
import "./sidebar.css";
import { useUserStatus } from "../middleware/StateContext";
import { useAuth } from "../middleware/AuthContext";

const Sidebar = () => {
  const { chosenRoom, connectedUsers, roomInfo, setRoomInfo } = useUserStatus();
  const { currentUser } = useAuth();
  const [currentMessage, setCurrentMessage] = useState("");

  const sendMessage = async (message) => {
    const currentMessages = roomInfo.chatMessages;
    const newMessage = {
      username: currentUser.displayName,
      message: message,
      type: "message",
    };

    setRoomInfo({
      ...roomInfo,
      chatMessages: currentMessages ? [...currentMessages, newMessage] : [newMessage],
    });
  };

  useEffect(() => {}, []);

  return (
    <div className="sidebar w-52 h-screen bg-slate-900 fixed right-0 text-slate-200 flex flex-col rounded-s-md">
      {/* room info */}
      <div className="info-container w-full pl-1 flex-shrink-0">
        {/* room name */}
        <div className="room-container flex items-center">
          <TiVideo color="slate-400" size={20} className="dark:text-slate-400" />
          <p className="pl-2 text-base">{chosenRoom}</p>
        </div>
        <div className="line-divider  h-[1px] bg-slate-700"></div>
        {/* room members */}
        <div className="connected-users flex flex-wrap">
          {/* Use map to render each connected user */}
          {connectedUsers.map((user, index) => (
            <div key={index} className="flex items-center mb-1 mt-1 mr-1">
              <TiUser color="slate-400" size={13} className="dark:text-slate-400" />
              <p className="text-xs">{user}</p>
            </div>
          ))}
        </div>
      </div>
      {/* line divider */}
      <div className="line-divider h-[1px] bg-slate-700"></div>
      {/* room messages */}
      <div className="chat-container pr-1 w-full pl-1 pt-1 flex-1 overflow-y-auto">
        {/* Use map to render each chat message */}
        {roomInfo.chatMessages?.map((message, index) => (
          <div
            key={index}
            className={`flex flex-col mb-[5px] ${message.type === "system" ? "text-secondary-500" : ""}`}>
            <p className="text-xs pl-1 font-bold break-words">{message.username}:</p>
            <p className="text-xs pl-1 break-words">{message.message}</p>
          </div>
        ))}
      </div>
      <div className="line-divider mb-[4px] h-[1px] bg-slate-700"></div>
      {/* chat input box */}
      <div className="chat-input-container w-full bottom-0 h-8 pl-1 pr-1 pb-1 ">
        <input
          type="text"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              if (currentMessage.length > 0) {
                sendMessage(currentMessage);
                setCurrentMessage("");
              }
            }
          }}
          onChange={(e) => {
            if (e.target.value.length !== 500) {
              setCurrentMessage(e.target.value.slice(0, 500));
            }
          }}
          value={currentMessage}
          placeholder="Type a message"
          className="w-full h-full bg-slate-800 text-xs text-slate-200 outline-none pl-2 rounded-lg"
        />
      </div>
    </div>
  );
};

export default Sidebar;
