import React from "react";
import { useSettings } from "../../context/SettingsContext";

const DEFAULT_PROMPT = `Tu es un assistant qui gère un fichier tasks.json.
Réponds UNIQUEMENT par du JSON strict valide.
Schéma attendu (v1): {"tasks":[{"id":"T001","title":"...","description":"...","priority":"high|medium|low","done":false,"dependencies":[],"tags":[]}]}.
- N'ajoute pas de texte hors JSON.
- Si le JSON actuel est fourni, retourne une version mise à jour en respectant le schéma.
- Conserve les IDs existants, ajoute-en de nouveaux si nécessaire (format T###).`;

const SystemPromptEditor: React.FC = () => {
  const { settings, setSettings } = useSettings();

  const handleReset = () => setSettings({ systemPrompt: DEFAULT_PROMPT });

  return (
    <div style={{ marginBottom: 8 }}>
      <label htmlFor="systemPrompt" style={{ fontWeight: "bold" }}>Prompt système&nbsp;:</label>
      <textarea
        id="systemPrompt"
        rows={4}
        style={{ width: "100%", marginTop: 4 }}
        value={settings.systemPrompt ?? ""}
        onChange={e => setSettings({ systemPrompt: e.target.value })}
        placeholder="Prompt système (optionnel)"
        autoComplete="off"
      />
      <div style={{ marginTop: 4, textAlign: "right" }}>
        <button type="button" className="app-btn" onClick={handleReset}>
          Réinitialiser le prompt
        </button>
      </div>
    </div>
  );
};

export default SystemPromptEditor;
