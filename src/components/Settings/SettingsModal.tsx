import React, { useState } from "react";
import { useSettings } from "../../context/SettingsContext";

type SettingsModalProps = {
  onClose: () => void;
};

const SettingsModal: React.FC<SettingsModalProps> = ({ onClose }) => {
  const { settings, setSettings } = useSettings();
  const [local, setLocal] = useState(settings);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setLocal(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    setSettings(local);
    onClose();
  };

  return (
    <div className="modal" onClick={onClose}>
      <div className="modal-content card" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Paramètres</h2>
          <button className="close-button" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div className="settings-section">
            <h3>Connecteurs LLM</h3>
            <div className="form-group">
              <label>Fournisseur LLM</label>
              <select name="provider" value={local.provider} onChange={handleChange}>
                <option value="openai">OpenAI</option>
                <option value="openrouter">OpenRouter</option>
              </select>
            </div>
            <div className="form-group">
              <label>Clé API OpenAI</label>
              <input
                type="password"
                name="apiKey"
                value={local.apiKey}
                onChange={handleChange}
                placeholder="Entrez votre clé API OpenAI"
                autoComplete="off"
              />
            </div>
            <div className="form-group">
              <label>Modèle</label>
              <input
                type="text"
                name="model"
                value={local.model}
                onChange={handleChange}
                placeholder="Modèle (ex: gpt-4o-mini)"
              />
            </div>
            <div className="form-group">
              <label>Prompt système</label>
              <textarea
                name="systemPrompt"
                value={local.systemPrompt ?? ""}
                onChange={handleChange}
                rows={3}
                placeholder="Prompt système (optionnel)"
              />
            </div>
          </div>
          <div className="settings-section">
            <h3>Apparence</h3>
            <div className="form-group">
              <label>Thème</label>
              <select disabled>
                <option value="dark">Sombre</option>
                <option value="light">Clair</option>
              </select>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="primary" onClick={handleSave}>Enregistrer</button>
          <button onClick={onClose}>Annuler</button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
