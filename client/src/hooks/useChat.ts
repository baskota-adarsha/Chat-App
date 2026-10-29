import { useRef, useState } from "react";
import type {
  ChatMessage,
  ClientToServerEvents,
  ServerToClientEvents,
} from "../types/chat";
import { type Socket } from "socket.io-client";

type ChatSocket = Socket<ServerToClientEvents, ClientToServerEvents>;
const SERVER_URL = "http://localhost:3005";
export function useChat(
  username: string,
  onFatalError: (message: string) => void,
) {
  const socketRef = useRef<ChatSocket | null>(null);
  const roomRef = useRef("general");
  const [room, setRoom] = useState("general");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [users, setUsers] = useState<String[]>([]);
}
