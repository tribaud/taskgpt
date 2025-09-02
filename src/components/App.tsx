import React, { useState, useEffect, createContext } from "react";
import TaskEditor from "./TaskEditor/TaskEditor";
import ChatPanel from "./Chat/ChatPanel";
import { SettingsProvider } from "../context/SettingsContext";

// Palette inspirée de GitHub
const GRAY_DARK_BG = "#22272e";
const GRAY_DARK_PANEL = "#2d333b";
const GRAY_DARK_BORDER = "#444c56";
const GRAY_DARK_TEXT = "#f5f6fa";
const GRAY_LIGHT_BG = "#f6f8fa";
const GRAY_LIGHT_PANEL = "#fafbfc";
const GRAY_LIGHT_BORDER = "#e1e4e8";
const GRAY_LIGHT_TEXT = "#222";

const THEME_KEY = "taskgpt_theme";

export const ThemeContext = createContext<"light" | "dark">("dark");

const App: React.FC = () => {
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    return (localStorage.getItem(THEME_KEY) as "light" | "dark") || "dark";
  });

  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
    localStorage.setItem(THEME_KEY, theme);
    document.body.style.background = theme === "dark" ? GRAY_DARK_BG : GRAY_LIGHT_BG;
    document.body.style.color = theme === "dark" ? GRAY_DARK_TEXT : GRAY_LIGHT_TEXT;
  }, [theme]);

  const toggleTheme = () => setTheme(t => (t === "light" ? "dark" : "light"));

  return (
    <SettingsProvider>
      <ThemeContext.Provider value={theme}>
        <div
          className="app-root"
          style={{
            display: "flex",
            flexDirection: "column",
            minHeight: "100vh",
            background: theme === "dark" ? GRAY_DARK_BG : GRAY_LIGHT_BG,
            color: theme === "dark" ? GRAY_DARK_TEXT : GRAY_LIGHT_TEXT
          }}
        >
          <header
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "16px 24px 0 24px",
              background: theme === "dark" ? GRAY_DARK_BG : GRAY_LIGHT_BG,
              color: theme === "dark" ? GRAY_DARK_TEXT : GRAY_LIGHT_TEXT
            }}
          >
            <h1 style={{ margin: 0, fontSize: "2rem" }}>Éditeur de tâches (tasks.json) + Chat IA</h1>
            <button
              id="themeToggle"
              className="theme-toggle"
              title="Changer le thème"
              style={{ fontSize: 24, marginLeft: 16, background: "none", border: "none", color: "inherit", cursor: "pointer" }}
              onClick={toggleTheme}
            >
              {theme === "light" ? "☀️" : "🌙"}
            </button>
          </header>
          <div style={{ display: "flex", flex: 1 }}>
            <div
              style={{
                flex: 2,
                padding: 16,
                background: theme === "dark" ? GRAY_DARK_PANEL : GRAY_LIGHT_PANEL,
                borderRight: `1px solid ${theme === "dark" ? GRAY_DARK_BORDER : GRAY_LIGHT_BORDER}`,
                color: theme === "dark" ? GRAY_DARK_TEXT : GRAY_LIGHT_TEXT
              }}
            >
              <TaskEditor />
            </div>
            <div
              style={{
                flex: 1,
                padding: 16,
                background: theme === "dark" ? GRAY_DARK_PANEL : GRAY_LIGHT_PANEL,
                color: theme === "dark" ? GRAY_DARK_TEXT : GRAY_LIGHT_TEXT,
                minHeight: "100vh"
              }}
            >
              <ChatPanel />
            </div>
          </div>
        </div>
      </ThemeContext.Provider>
    </SettingsProvider>
  );
};

export default App;
