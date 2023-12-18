import React, { createContext, useContext, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

import { AuthProvider } from "../middleware/AuthContext";
import { UserStateProvider } from "../middleware/StateContext";

const ThemeContext = createContext();

export function useTheme() {
  return useContext(ThemeContext);
}

export default function Root() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setTheme(mediaQuery.matches ? "dark" : "light");

    const handler = (e) => setTheme(e.matches ? "dark" : "light");
    mediaQuery.addEventListener("change", handler);

    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <AuthProvider>
        <UserStateProvider>
          <Outlet />
        </UserStateProvider>
      </AuthProvider>
    </ThemeContext.Provider>
  );
}
