import React from "react";
import TaskEditor from "./TaskEditor/TaskEditor";
import ChatPanel from "./Chat/ChatPanel";

const App: React.FC = () => (
  <div className="app-root" style={{ display: "flex", flexDirection: "row", minHeight: "100vh" }}>
    <div style={{ flex: 2, padding: 16 }}>
      <TaskEditor />
    </div>
    <div style={{ flex: 1, padding: 16, borderLeft: "1px solid #eee", background: "#fafbfc" }}>
      <ChatPanel />
    </div>
  </div>
);

export default App;
