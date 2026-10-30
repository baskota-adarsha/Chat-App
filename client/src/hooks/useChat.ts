import { useEffect, useRef, useState, useCallback } from "react";
import type {
  ChatMessage,
  ClientToServerEvents,
  ServerToClientEvents,
} from "../types/chat";
import { io, type Socket } from "socket.io-client";

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
  const [users, setUsers] = useState<string[]>([]);

  useEffect(() => {
    const socket: ChatSocket = io(SERVER_URL, {
      auth: { username },
    });
    socketRef.current = socket;
    socket.on("connect", () => {
      setMessages([]);
      setUsers([]);
      socket.emit("joinRoom", roomRef.current);
    });

    socket.on("connect_error", (err) => {
      if (!socket.active) {
        onFatalError(err.message);
      }
    });
    socket.on("message", (msg) => {
      if (msg.room !== roomRef.current) return;

      setMessages((prev) => [...prev, msg]);
    });
    socket.on("roomUsers", (data) => {
      if (data.room !== roomRef.current) return;
      setUsers(data.users);
    });
    return () => {
      socket.disconnect();
    };
  }, [username]);

  const joinRoom = useCallback((next: string) => {
    if (next === roomRef.current) return;

    roomRef.current = next;
    setRoom(next);
    setMessages([]);
    setUsers([]);

    socketRef.current?.emit("joinRoom", next);
  }, []);
}
