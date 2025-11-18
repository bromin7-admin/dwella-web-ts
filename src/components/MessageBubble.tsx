import React from "react";
import { FeedbackButtons } from "./FeedbackButtons";
import { ChatRole } from "../store/chatStore";

interface Props {
  role: ChatRole;
  content: string;
  sourceId?: string;
}

export const MessageBubble: React.FC<Props> = ({ role, content, sourceId }) => {
  const isUser = role === "user";

  return (
    <div className={`bubble-row ${isUser ? "bubble-right" : "bubble-left"}`}>
      {!isUser && (
        <img
          src="/copilot-avatar.png"
          alt="Copilot"
          className="bubble-avatar"
        />
      )}

      <div>
        <div className={`bubble ${isUser ? "bubble-user" : "bubble-ai"}`}>
          {content}
        </div>

        {!isUser && <FeedbackButtons messageId={sourceId} />}
      </div>
    </div>
  );
};
