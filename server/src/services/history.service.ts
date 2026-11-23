import type { ChatMessage } from "../types/chat";

const MAX_MESSAGES = 10;

// room ko naam -> tyo room ko last 10 message
const history = new Map<string, ChatMessage[]>();

export function addToHistory(msg: ChatMessage): void {
  const list = history.get(msg.room) ?? [];
  list.push(msg);
  if (list.length > MAX_MESSAGES) list.shift(); // sabbhanda purano hataune
  history.set(msg.room, list);
}

export function getHistory(room: string): ChatMessage[] {
  return history.get(room) ?? [];
}
