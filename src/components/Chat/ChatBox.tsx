import React from "react";

const ChatBox: React.FC<React.PropsWithChildren> = ({ children }) => (
  <div id="chatBox" className="card" style={{ margin: "8px 0 8px", padding: 10, minHeight: 80, maxHeight: 200, overflowY: "auto" }}>
    {children}
  </div>
);

export default ChatBox;
