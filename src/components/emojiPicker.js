import React, { useState, useMemo } from "react";
import { FixedSizeGrid as Grid } from "react-window";
import emojis from "./emojis.json"; // Importing the emojis

const EmojiSelector = ({ open, setOpen, emojiClick }) => {
  const [search, setSearch] = useState("");

  const close = (focusAfter) => {
    setOpen(false);
    if (focusAfter) {
      focusAfter.focus();
    }
  };

  const filteredEmojis = useMemo(() => {
    return Object.keys(emojis)
      .filter((key) => key.includes(search))
      .reduce((obj, key) => {
        obj[key] = emojis[key];
        return obj;
      }, {});
  }, [search]);

  const handleEscape = (event) => {
    if (event.key === "Escape") {
      close();
    }
  };

  const padding = 1; // Padding around each cell
  const margin = 6; // Margin around each cell
  const baseCellSize = 32;
  const totalCellSize = baseCellSize + padding * 2; // Total size including padding
  const columnCount = 8;

  // Grid cell renderer
  const Cell = ({ columnIndex, rowIndex, style }) => {
    const emojiIndex = rowIndex * columnCount + columnIndex;
    const emojiKey = Object.keys(filteredEmojis)[emojiIndex];
    if (!emojiKey) return <div style={style}></div>;
    const emoji = filteredEmojis[emojiKey];

    return (
      <button
        style={{
          ...style,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: `${margin}px`, // Add margin
          padding: `${padding}px`, // Add padding
          boxSizing: "border-box",
          height: `${baseCellSize}px`, // Fixed height excluding margin
          width: `${baseCellSize}px`, // Fixed width excluding margin
        }}
        className="cursor-pointer rounded-md bg-slate-800 hover:bg-blue-100"
        title={emojiKey}
        onClick={() => emojiClick(emoji)}>
        <span className="text-lg">{emoji}</span>
      </button>
    );
  };

  return (
    <div
      id="dropdown-button"
      className="left-0 mt-2 p-4 max-h-52  bg-slate-900 shadow-md rounded-lg"
      style={{ display: open ? "block" : "none", width: "24.85rem" }}
      onKeyDown={handleEscape}>
      <input
        type="search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="h-8 w-full px-2 mb-2 text-sm border border-1 text-slate-300 border-slate-600 bg-slate-800 rounded-md placeholder:text-gray-500"
        placeholder="Search an emoji..."
      />
      <Grid
        className="overflow-y-auto"
        columnCount={columnCount}
        columnWidth={totalCellSize + margin * 2} // Include margin in size calculation
        height={146}
        rowCount={Math.ceil(Object.keys(filteredEmojis).length / columnCount)}
        rowHeight={totalCellSize + margin * 2} // Include margin in size calculation
        width={380}>
        {Cell}
      </Grid>
    </div>
  );
};

export default EmojiSelector;
