import React from "react";

const UserMessageInput: React.FC = () => (
  <div style={{ marginTop: 8 }}>
    <textarea
      id="userMsg"
      rows={3}
      placeholder="Ex: Décompose T002 en 3 sous-tâches dépendantes…"
      style={{ width: "100%" }}
    />
    <div style={{ marginTop: 4, display: "flex", gap: 8 }}>
      <button id="btnSend">Envoyer à l’IA</button>
      <button id="btnInject">✅ Inclure JSON actuel</button>
    </div>
    <p className="muted" style={{ fontSize: "0.9em", color: "#888" }}>
      ⚠️ L'appel direct au navigateur expose votre clé API au code client. Pour une prod sécurisée, passez par un proxy serveur ou OpenRouter avec clés côté serveur.
    </p>
  </div>
);

export default UserMessageInput;
