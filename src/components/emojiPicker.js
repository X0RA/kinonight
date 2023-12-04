import React, { useState, useRef } from "react";

const EmojiDropdown = ({ open, setOpen }) => {
  const [search, setSearch] = useState("");
  const [input, setInput] = useState("🙂");
  const buttonRef = useRef(null);
  const panelRef = useRef(null);

  const emojis = {
    "tractor, farm, machine, agriculture": "🚜",
    "leaf, plant, nature, green, agricultre, ecology": "🌿",
    "corn, field, agricuultre, vegetable, plant, nature, green, ecology": "🌽",
    "fish, sea, ocan, swimming, water": "🐟",
    "home, house, building, apartment, residence": "🏠",
    "university, official, building, columns, institution": "🏦",
    "school, education, student, learn, diploma": "🏫",
    "education, school, student, learn, diploma": "🎓",
    "child, children, young": "🧒",
    "book, paper, knowledge, reading, library, books, literature": "📖",
    "scroll, paper, document, page, book": "📜",
    "contract, bookmark, tab, sheet, signature": "📑",
    "pencil, write, edit, paper, memo, note": "✏️",
    "pen, write, paper, memo, note, fountain pen": "✒️",
    "military, army, soldier, war, helmet": "🪖",
    "tool, measure, scale, ruler, law, regulation, enforcement": "⚖️",
    "police, cop, urgence, security, law, enforcement, arrest, criminal, law enforcement": "🚓",
    "shield, protection, security, safety, defense": "🛡️",
    "urgence, police, fire, light, warning, danger": "🚨",
    "bomb, explode, explosion, bang, blast, grenade": "💣",
    "fire, flame, hot, heat, blaze, brigade": "🔥",
    "thermometer, hot, temperature, warm, ill, illness, fever": "🌡️",
    "money, bag, dollar, coin": "💰",
    "money, purse, wallet, bag, dollar, euro": "👛",
    "credit, bank, money, loan, bill, payment, credit card": "💶",
    "chart, graph, analytics, statistics, data, report": "📊",
    "money, dollar, currency, payment, bank, banknote, exchange, cash": "💱",
    "money, dollar, currency, payment, bank, banknote, exchange, cash": "💵",
    "money, dollar, currency, payment, bank, banknote, exchange, cash, fly": "💸",
    "shopping, buy, purchase, cart, buy": "🛒",
    "shopping, buy, purchase, shopping cart": "🛍️",
    "travel, luggage, bag, suitcase, bag": "🧳",
    "film, movie, motion, cinema, theater, culture": "🎬",
    "computer, laptop, digital, keyboard, monitor, screen": "💻",
    "lightning, bolt, electricity, science": "⚡",
    "light, bulb, electric, electricity": "💡",
    "flashlight, light, lamp": "🔦",
    "rocket, launch, space, ship, plane, space, start up": "🚀",
    "hospital, medical, center, care, health, sickness, disease, illness": "🏥",
    "clothing, lab, coat, science, laboratory": "🥼",
    "factory, building, manufacturing, production, construction, polution": "🏭",
    "globe, world, earth, planet, map, travel, space": "🌍",
    "location, map, pin, marker, navigation, aid": "📍",
    "europe, european union, flag, country, nation, place, location, geography, globe": "🇪🇺",
    "custom, border, control, security, safety, protection": "🛂",
    "bus, car, transportation, transportation vehicle, trolly": "🚎",
    "alarm, clock, morning, ring, wake up": "⏰",
    "clock, time, timer, watch, stopwatch": "⏱",
    "truck, transportation, delivery, road, vehicule": "🚚",
    "truck, transportation, delivery, road, vehicule": "🚛",
    "key, lock, password, secure": "🔑",
    "trophy, award, cup, competition, game, sport, winner": "🏆",
    "win, medal, gold, silver, bronze, rank, trophy, sport, competition, game, award": "🏅",
    "flex, muscle, body, workout, exercise": "💪",
    "congratulations, party, popper, confetti, celebration": "🎉",
    "ticket, prize, gift, award, prize, gift, admission": "🎟",
    "star, gold, yellow, sky, space, night, evening, dusk": "⭐️",
    "star, astronomy, sparkle, sparkles, magic": "✨",
    "heart, like, favorite, love": "❤️",
    "handshake, agreement, hands": "🤝‍",
    "eye, vision, look, see": "👀",
    "megaphone, announcement, broadcast, public, speaking": "📣",
    "dice, game, chance, roll, random, target, center": "🎯",
    "gift, present, package, box, celebrate, birthday, party": "🎁",
    "balloon, celebration,party, birthday,": "🎈",
    "hourglass, time, timer, watch, stopwatch": "⏳",
    "clap, applause, bravo, hand, gesture, wave, hand clapping": "👏",
    "clown, face, funny, lol, party, hat": "🥳",
    "face, happy, joy, heart, love, emotion, smiley": "🥰",
    "sunglasses, cool, smile, smiley": "😎",
    "laughing, lol, smile, smiley": "😂",
    "open hands, smiley, hug, love, care": "🤗",
    "smiley, face, happy, joy, emotion, smiley": "🙂",
  };

  const toggle = () => {
    if (open) {
      close();
    } else {
      buttonRef.current.focus();
      setOpen(true);
    }
  };

  const close = (focusAfter) => {
    setOpen(false);
    if (focusAfter) {
      focusAfter.focus();
    }
  };

  const filteredEmojis = Object.keys(emojis)
    .filter((key) => key.includes(search))
    .reduce((obj, key) => {
      obj[key] = emojis[key];
      return obj;
    }, {});

  const handleEscape = (event) => {
    if (event.key === "Escape") {
      close(buttonRef.current);
    }
  };

  const handleClickOutside = (event) => {
    if (panelRef.current && !panelRef.current.contains(event.target)) {
      close(buttonRef.current);
    }
  };

  return (
    <div
      ref={panelRef}
      id="dropdown-button"
      className="absolute left-0 mt-2 p-4 max-h-64 bg-white shadow-md overflow-scroll rounded"
      style={{ display: open ? "block" : "none", width: "24.85rem" }}
      onKeyDown={handleEscape}
      onMouseDown={handleClickOutside}>
      <input
        type="search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="h-10 w-full px-2 mb-2 text-sm border border-1 border-slate-200 bg-gray-50 rounded-md placeholder:text-gray-500"
        placeholder="Search an emoji..."
      />
      {Object.entries(filteredEmojis).map(([keywords, emoji]) => (
        <button
          key={emoji}
          className="inline-block py-2 px-3 m-1 cursor-pointer rounded-md bg-gray-100 hover:bg-blue-100"
          title={keywords}
          onClick={() => {
            setInput(emoji);
            toggle();
          }}>
          <span className="inline-block w-5 h-5">{emoji}</span>
        </button>
      ))}
    </div>
  );
};

export default EmojiDropdown;
