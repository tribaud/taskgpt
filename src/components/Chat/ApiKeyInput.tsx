import React from "react";
import { useSettings } from "../../context/SettingsContext";

const ApiKeyInput: React.FC = () => {
  const { settings, setSettings } = useSettings();
  return (
    <div style={{ marginBottom: 8 }}>
      <label htmlFor="apiKey" style={{ fontWeight: "bold" }}>Clé API OpenAI&nbsp;:</label>
      <input
        id="apiKey"
        type="password"
        placeholder="OpenAI API Key"
        style={{ minWidth: 220, marginLeft: 8 }}
        value={settings.apiKey}
        onChange={e => setSettings({ apiKey: e.target.value })}
        autoComplete="off"
      />
    </div>
  );
};

export default ApiKeyInput;
