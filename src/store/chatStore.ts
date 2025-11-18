import { create } from "zustand";
import { api } from "../../api/http";

export type ChatRole = "user" | "assistant" | "error";

export interface ChatMessage {
  id: string | number;
  role: ChatRole;
  content: string;
  sourceId?: string;
}

interface ChatState {
  messages: ChatMessage[];
  loading: boolean;
  historyLoaded: boolean;
  loadHistory: () => Promise<void>;
  sendMessage: (text: string) => Promise<void>;
}

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  loading: false,
  historyLoaded: false,

  loadHistory: async () => {
    if (get().historyLoaded) return;
    try {
      const res = await api.get("/chat_room/copilot", {
        params: { limit: 20, page: 0 }
      });
      const body = res.data as {
        meta: { total_count: number };
        data: Array<{
          chats: { id: number | string; message: string };
          sender: { id: number | null } | null;
        }>;
      };

      const messages: ChatMessage[] = body.data.map((item) => ({
        id: item.chats.id,
        role: item.sender && item.sender.id ? "user" : "assistant",
        content: item.chats.message,
        sourceId: String(item.chats.id)
      }));

      set({ messages, historyLoaded: true });
    } catch (e) {
      console.error("Failed to load chat history", e);
    }
  },

  sendMessage: async (text: string) => {
    if (!text.trim()) return;
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    const userMsg: ChatMessage = {
      id: Date.now(),
      role: "user",
      content: text
    };

    set((state) => ({
      messages: [...state.messages, userMsg],
      loading: true
    }));

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || "http://api.stage.dwella.co/v2"}/chat_room/copilot/stream`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ message: text })
        }
      );

      if (!response.body) {
        throw new Error("No response body");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");

      let aiMsg: ChatMessage = {
        id: Date.now() + 1,
        role: "assistant",
        content: ""
      };

      // Push initial empty AI message
      set((state) => ({
        messages: [...state.messages, aiMsg]
      }));

      let done = false;
      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        if (done || !value) break;

        const chunk = decoder.decode(value);
        aiMsg = {
          ...aiMsg,
          content: aiMsg.content + chunk
        };

        set((state) => ({
          messages: state.messages.map((m) =>
            m.id === aiMsg.id ? aiMsg : m
          )
        }));
      }
    } catch (e) {
      console.error("Error while streaming from copilot", e);
      const errorMsg: ChatMessage = {
        id: Date.now() + 2,
        role: "error",
        content: "Something went wrong. Please try again."
      };
      set((state) => ({
        messages: [...state.messages, errorMsg]
      }));
    } finally {
      set({ loading: false });
    }
  }
}));
