"use client";
import { useState, useEffect } from "react";
import { SunIcon, MoonIcon } from "@heroicons/react/20/solid";

const ThemeToggle = () => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Check if user has a theme preference in localStorage
    const theme = localStorage.getItem("theme");
    setDarkMode(theme === "dark");
    document.documentElement.setAttribute("data-theme", theme || "light");
  }, []);

  const toggleTheme = () => {
    const newTheme = darkMode ? "light" : "dark";
    setDarkMode(!darkMode);
    localStorage.setItem("theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full hover:bg-[#252945] transition-colors"
      aria-label="Toggle theme"
    >
      {darkMode ? (
        <SunIcon className="w-5 h-5 text-[#858BB2]" />
      ) : (
        <MoonIcon className="w-5 h-5 text-[#858BB2]" />
      )}
    </button>
  );
};

export default ThemeToggle;
