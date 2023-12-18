import React from "react";
import { useTheme } from "../pages/root"; // Update the path accordingly

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return <button onClick={toggleTheme}>Toggle to {theme === "light" ? "Dark" : "Light"} Mode</button>;
};

export default ThemeToggle;
