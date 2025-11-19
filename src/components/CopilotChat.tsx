import React, { useEffect, useRef } from "react";
import { useChatStore } from "../store/chatStore";
import { Suggestions } from "./Suggestions";
import { MessageBubble } from "./MessageBubble";

export const CopilotChat: React.FC = () => {
  const { messages, loading, loadHistory, sendMessage } = useChatStore();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadHistory();
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [messages]);

  const handleSend = (text: string) => {
    sendMessage(text);
  };

  return (
    <div className="copilot-container">
      <h2 className="copilot-header">AI Mortgage Copilot</h2>

      <div className="messages-wrapper" ref={scrollRef}>
        {messages?.map((m) => (
          <MessageBubble
            key={m.id}
            role={m.role}
            content={m.content}
            sourceId={m.sourceId}
          />
        ))}

        {loading && (
          <div className="thinking">
            <span className="spinner" /> Thinking…
          </div>
        )}
      </div>

      <Suggestions onSend={handleSend} />
    </div>
  );
};