import React, { useEffect, useRef, useState } from "react";
import { useChatStore } from "../store/chatStore";
import { MessageBubble } from "./MessageBubble";
import { Suggestions } from "./Suggestions";

export const CopilotChat: React.FC = () => {
  const { messages, sendMessage, loadHistory, loading } = useChatStore();
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    void loadHistory();
  }, [loadHistory]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  }, [messages, loading]);

  const handleSend = (text?: string) => {
    const toSend = (text ?? input).trim();
    if (!toSend) return;
    void sendMessage(toSend);
    setInput("");
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSend();
  };

  return (
    <div className="copilot-container">
      <h2 className="copilot-header">AI Mortgage Copilot</h2>

      <div className="messages-wrapper" ref={scrollRef}>
        {messages.map((m) => (
          <MessageBubble
            key={m.id}
            role={m.role}
            content={m.content}
            sourceId={m.sourceId}
          />
        ))}

        {loading && (
          <div className="thinking">
            <span className="spinner" />
            Thinking…
          </div>
        )}
      </div>

      <Suggestions onSend={handleSend} />

      <form className="input-bar" onSubmit={onSubmit}>
        <input
          className="input-field"
          placeholder="Ask Dwella, your homebuying guide…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button className="input-send" type="submit">
          ➤
        </button>
      </form>
    </div>
  );
};
