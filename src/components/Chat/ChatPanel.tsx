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
  tasks?: Task[];
};

const ChatPanel: React.FC<ChatPanelProps> = ({ onImportTasks, tasks }) => {
  const { settings } = useSettings();
  const [userMsg, setUserMsg] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [injectJson, setInjectJson] = useState(true);

  const handleSend = async () => {
    if (!userMsg.trim() || !settings.apiKey) return;
    setMessages(msgs => [...msgs, { role: "user", content: userMsg }]);
    setLoading(true);
    try {
      let prompt = userMsg;
      if (injectJson && tasks) {
        prompt = `JSON actuel:\n${JSON.stringify(tasks, null, 2)}\n\n${userMsg}`;
      }
      const aiResponse = await sendToOpenAI({
        apiKey: settings.apiKey,
        model: settings.model,
        prompt,
        systemPrompt: settings.systemPrompt ?? ""
      });
      setMessages(msgs => [...msgs, { role: "ai", content: aiResponse }]);
      // Tenter d'extraire du JSON et d'importer les tâches
      try {
        // Extraire le bloc ```json ... ``` si présent
        let jsonText = aiResponse;
        const match = aiResponse.match(/```json\s*([\s\S]*?)```/i);
        if (match) {
          jsonText = match[1];
        }
        const json = JSON.parse(jsonText);
        console.log("JSON importé par l'IA :", json);
        if (Array.isArray(json)) {
          onImportTasks?.(json);
        } else if (json.tasks && Array.isArray(json.tasks)) {
          onImportTasks?.(json.tasks);
        }
      } catch (err) {
        console.log("Erreur de parsing JSON IA :", err);
      }
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
          <button
            id="btnInject"
            type="button"
            className={`app-btn${injectJson ? " primary" : ""}`}
            onClick={() => setInjectJson(v => !v)}
            style={{ background: injectJson ? "#7aa2ff" : undefined }}
          >
            {injectJson ? "✅ Inclure JSON actuel" : "Inclure JSON actuel"}
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
