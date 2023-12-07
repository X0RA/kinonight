import React, { useState, useRef } from "react";

import EmojiDropdown from "./emojiPicker";

const Temp = () => {
  const [emojiOpen, setEmojiOpen] = useState(true);
  return (
    <div className="w-full h-screen flex pl-5 lg:pl-0 lg:justify-center pt-5 bg-primary-600">
      <button
        className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center"
        onClick={() => setEmojiOpen(!emojiOpen)}>
        <span>Emoji</span>
      </button>
      <EmojiDropdown emojiClick={(e) => console.log(e)} open={emojiOpen} setOpen={setEmojiOpen}></EmojiDropdown>
    </div>
  );
};

export default Temp;
