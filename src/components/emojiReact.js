import React, { useState, useEffect } from "react";
import anime from "animejs";
import "./EmojiReactions.css";
import { useUserStatus } from "../middleware/StateContext";

const EmojiReactions = () => {
  const [emojis, setEmojis] = useState([]);
  const { chosenRoom, setVideoInfo, roomState, setRoomState, videoInfo, roomInfo, setRoomInfo } = useUserStatus();

  useEffect(() => {
    emojis.forEach((emoji) => {
      if (!emoji.isAnimating) {
        anime({
          targets: `#emoji-${emoji.id}`,
          translateY: [0, -window.innerHeight * 0.4],
          rotate: {
            value: "1turn",
            duration: 1800,
            easing: "linear",
          },
          opacity: [1, 0],
          duration: 1800,
          easing: "easeInOutQuad",
          begin: () => {
            setEmojis((currentEmojis) =>
              currentEmojis.map((e) => (e.id === emoji.id ? { ...e, isAnimating: true } : e))
            );
          },
          complete: () => {
            setEmojis((currentEmojis) => currentEmojis.filter((e) => e.id !== emoji.id));
          },
        });
      }
    });
  }, [emojis]);

  const addEmoji = async (emojiChar, id) => {
    const positionX = Math.random() * 100;
    setEmojis((currentEmojis) => [...currentEmojis, { emoji: emojiChar, id, positionX, isAnimating: false }]);
  };

  useEffect(() => {
    if (roomInfo?.reactionEmoji) {
      let emoji = roomInfo.reactionEmoji.split(":")[0];
      let id = roomInfo.reactionEmoji.split(":")[1];
      if (emojis.find((e) => e.id === id)) {
        setEmojis((currentEmojis) => currentEmojis.filter((e) => e.id !== id));
      } else {
        addEmoji(emoji);
      }
    }
  }, [roomInfo]);

  return (
    <div className="emoji-container">
      {emojis.map(({ emoji, id, positionX }) => (
        <div key={id} id={`emoji-${id}`} className="emoji-animation" style={{ left: `${positionX}%`, bottom: "0px" }}>
          {emoji}
        </div>
      ))}
    </div>
  );
};

export default EmojiReactions;
