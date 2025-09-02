import React from "react";
import ApiKeyInput from "./ApiKeyInput";
import ModelSelector from "./ModelSelector";
import SystemPromptEditor from "./SystemPromptEditor";
import ChatBox from "./ChatBox";
import UserMessageInput from "./UserMessageInput";

const ChatPanel: React.FC = () => (
  <div>
    <ApiKeyInput />
    <ModelSelector />
    <SystemPromptEditor />
    <ChatBox />
    <UserMessageInput />
  </div>
);

export default ChatPanel;
