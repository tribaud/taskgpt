import React, { useState } from "react";
import ApiKeyInput from "./ApiKeyInput";
import ModelSelector from "./ModelSelector";
import SystemPromptEditor from "./SystemPromptEditor";
import ChatBox from "./ChatBox";
import UserMessageInput from "./UserMessageInput";
import { useSettings } from "../../context/SettingsContext";
import { sendToOpenAI } from "../../services/openaiService";

type Message = { role: "user" | "ai"; content: string };

import { Task } from "../TaskEditor/TaskEditor";

type ChatPanelProps = {
  onImportTasks?: (tasks: Task[]) => void;
};

const ChatPanel: React.FC<ChatPanelProps> = ({ onImportTasks }) => {
  const { settings } = useSettings();
  const [userMsg, setUserMsg] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!userMsg.trim() || !settings.apiKey) return;
    setMessages(msgs => [...msgs, { role: "user", content: userMsg }]);
    setLoading(true);
    try {
      const aiResponse = await sendToOpenAI({
        apiKey: settings.apiKey,
        model: settings.model,
        prompt: userMsg,
        systemPrompt: settings.systemPrompt ?? ""
      });
      setMessages(msgs => [...msgs, { role: "ai", content: aiResponse }]);
      // Tenter d'extraire du JSON et d'importer les tâches
      try {
        const json = JSON.parse(aiResponse);
        if (Array.isArray(json)) {
          onImportTasks?.(json);
        } else if (json.tasks && Array.isArray(json.tasks)) {
          onImportTasks?.(json.tasks);
        }
      } catch {}
    } catch (err: any) {
      setMessages(msgs => [...msgs, { role: "ai", content: "Erreur: " + err.message }]);
    }
    setLoading(false);
    setUserMsg("");
  };

  return (
    <div>
      <ApiKeyInput />
      <ModelSelector />
      <SystemPromptEditor />
      <ChatBox>
        {messages.length === 0 ? (
          <div className="muted">(Aucune conversation)</div>
        ) : (
          messages.map((msg, i) => (
            <div key={i} className={"msg " + msg.role}>
              {msg.content}
            </div>
          ))
        )}
        {loading && <div className="muted">Envoi en cours...</div>}
      </ChatBox>
      <div style={{ marginTop: 8 }}>
        <textarea
          id="userMsg"
          rows={3}
          placeholder="Ex: Décompose T002 en 3 sous-tâches dépendantes…"
          style={{ width: "100%" }}
          value={userMsg}
          onChange={e => setUserMsg(e.target.value)}
          disabled={loading}
        />
        <div style={{ marginTop: 4, display: "flex", gap: 8 }}>
          <button id="btnSend" onClick={handleSend} disabled={loading || !userMsg.trim() || !settings.apiKey}>
            Envoyer à l’IA
          </button>
          <button id="btnInject" disabled>
            ✅ Inclure JSON actuel
          </button>
        </div>
        <p className="muted" style={{ fontSize: "0.9em", color: "#888" }}>
          ⚠️ L'appel direct au navigateur expose votre clé API au code client. Pour une prod sécurisée, passez par un proxy serveur ou OpenRouter avec clés côté serveur.
        </p>
      </div>
    </div>
  );
};

export default ChatPanel;
