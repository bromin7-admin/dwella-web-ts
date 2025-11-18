import { api } from "./http";

export async function sendFeedback(messageId: string, helpful: boolean) {
  return api.post("/copilot-feedback", {
    messageId,
    helpful
  });
}
