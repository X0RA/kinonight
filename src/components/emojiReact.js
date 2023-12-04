import React, { useState, useEffect, useRef } from "react";
import anime from "animejs";
import "./EmojiReactions.css";
import { useUserStatus } from "../middleware/StateContext";

const EmojiReactions = () => {
  const [emojis, setEmojis] = useState([]);
  const { roomInfo } = useUserStatus();
  const lastEmoji = useRef(roomInfo?.reactionEmoji); // useRef to keep track of the last emoji

  const animateEmoji = (emoji) => {
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
      complete: () => {
        setEmojis((currentEmojis) => currentEmojis.filter((e) => e.id !== emoji.id));
      },
    });
  };

  const addEmoji = (emojiChar, id) => {
    const positionX = Math.random() * 100;
    const newEmoji = { emoji: emojiChar, id, positionX, isAnimating: true };
    setEmojis((currentEmojis) => [...currentEmojis, newEmoji]);

    // Introduce a slight delay before animating
    setTimeout(() => animateEmoji(newEmoji), 50);
  };

  useEffect(() => {
    if (roomInfo?.reactionEmoji && roomInfo.reactionEmoji !== lastEmoji.current) {
      let [emoji, id] = roomInfo.reactionEmoji.split(":");
      if (!emojis.find((e) => e.id === id)) {
        addEmoji(emoji, id);
      }
      lastEmoji.current = roomInfo.reactionEmoji; // Update the ref after handling the emoji
    }
  }, [roomInfo?.reactionEmoji]); // Depend only on roomInfo.reactionEmoji

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
