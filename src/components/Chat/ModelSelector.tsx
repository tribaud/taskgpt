import React from "react";
import { useSettings } from "../../context/SettingsContext";

const ModelSelector: React.FC = () => {
  const { settings, setSettings } = useSettings();
  return (
    <div style={{ marginBottom: 8 }}>
      <label htmlFor="model" style={{ fontWeight: "bold" }}>Modèle&nbsp;:</label>
      <select
        id="model"
        style={{ marginLeft: 8 }}
        value={settings.model}
        onChange={e => setSettings({ model: e.target.value })}
      >
        <option value="gpt-4o-mini">gpt-4o-mini</option>
        <option value="gpt-4o">gpt-4o</option>
        {/* Ajouter d'autres modèles ici si besoin */}
      </select>
    </div>
  );
};

export default ModelSelector;
