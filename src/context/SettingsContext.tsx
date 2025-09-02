import React, { createContext, useContext, useState, useEffect } from "react";

export type Settings = {
  apiKey: string;
  openrouterApiKey?: string;
  model: string;
  provider: "openai" | "openrouter";
  systemPrompt?: string;
  theme?: "light" | "dark";
};

const SETTINGS_KEY = "taskgpt_settings";

const defaultSettings: Settings = {
  apiKey: "",
  openrouterApiKey: "",
  model: "gpt-4o-mini",
  provider: "openai",
  systemPrompt: "",
  theme: "dark"
};

const SettingsContext = createContext<{
  settings: Settings;
  setSettings: (s: Partial<Settings>) => void;
}>({
  settings: defaultSettings,
  setSettings: () => {}
});

export const useSettings = () => useContext(SettingsContext);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettingsState] = useState<Settings>(() => {
    try {
      const raw = localStorage.getItem(SETTINGS_KEY);
      let loaded = raw ? { ...defaultSettings, ...JSON.parse(raw) } : defaultSettings;
      if (!loaded.systemPrompt || loaded.systemPrompt.trim() === "") {
        loaded.systemPrompt = defaultSettings.systemPrompt;
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(loaded));
      }
      return loaded;
    } catch {
      return defaultSettings;
    }
  });

  const setSettings = (update: Partial<Settings>) => {
    setSettingsState(prev => {
      const next = { ...prev, ...update };
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(next));
      return next;
    });
  };

  // Synchronisation si localStorage change ailleurs (autre onglet)
  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === SETTINGS_KEY && e.newValue) {
        setSettingsState({ ...defaultSettings, ...JSON.parse(e.newValue) });
      }
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, setSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};
