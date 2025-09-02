import React, { useState, useEffect, createContext } from "react";
import TaskEditor, { Task } from "./TaskEditor/TaskEditor";
import ChatPanel from "./Chat/ChatPanel";
import { SettingsProvider, useSettings } from "../context/SettingsContext";

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


const initialTasks: Task[] = [
  {
    id: "T001",
    title: "Exemple",
    description: "Description de la tâche",
    priority: "medium",
    done: false,
    tags: ["demo", "test"]
  }
];

const TASKS_KEY = "taskgpt_tasks";

const AppContent: React.FC = () => {
  const { settings, setSettings } = useSettings();
  const theme = settings.theme ?? "dark";
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const raw = localStorage.getItem(TASKS_KEY);
      return raw ? JSON.parse(raw) : initialTasks;
    } catch {
      return initialTasks;
    }
  });

  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
    localStorage.setItem(THEME_KEY, theme);
    document.body.style.background = theme === "dark" ? GRAY_DARK_BG : GRAY_LIGHT_BG;
    document.body.style.color = theme === "dark" ? GRAY_DARK_TEXT : GRAY_LIGHT_TEXT;
  }, [theme]);

  // Sauvegarder tasks dans localStorage à chaque modification
  useEffect(() => {
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const toggleTheme = () => setSettings({ theme: theme === "light" ? "dark" : "light" });

  return (
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
            color: theme === "dark" ? GRAY_DARK_TEXT : GRAY_LIGHT_TEXT,
            flexDirection: "column"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", width: "100%", justifyContent: "space-between" }}>
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
          </div>
          <div style={{ width: "100%", textAlign: "left", fontSize: "0.95em", color: "var(--muted-text)", marginTop: 2, fontFamily: "monospace", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {localStorage.getItem("taskgpt_lastfile_name") || "tasks.json"}
            {localStorage.getItem("taskgpt_lastfile_path") && localStorage.getItem("taskgpt_lastfile_path") !== localStorage.getItem("taskgpt_lastfile_name")
              ? " — " + localStorage.getItem("taskgpt_lastfile_path")
              : " (chemin non disponible en web)"}
          </div>
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
            <TaskEditor tasks={tasks} setTasks={setTasks} />
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
            <ChatPanel onImportTasks={setTasks} tasks={tasks} />
          </div>
        </div>
      </div>
    </ThemeContext.Provider>
  );
};

const App: React.FC = () => (
  <SettingsProvider>
    <AppContent />
  </SettingsProvider>
);

export default App;
