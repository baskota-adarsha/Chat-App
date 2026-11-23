import { useCallback, useEffect, useRef, useState } from "react";
import { io, type Socket } from "socket.io-client";
import { getClientId } from "../helpers/clientId";
import type {
  ChatMessage,
  ClientToServerEvents,
  RoomUser,
  ServerToClientEvents,
} from "../types/chat";

const SERVER_URL = "http://localhost:3001";

type ChatSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

export function useChat(
  username: string,
  onFatalError: (message: string) => void,
) {
  const socketRef = useRef<ChatSocket | null>(null);
  const roomRef = useRef("general"); // listener le sadhai nai naya room dekhos bhanera
  const [myId] = useState(getClientId); // mero unique id

  const [room, setRoom] = useState("general");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [users, setUsers] = useState<RoomUser[]>([]);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    const socket: ChatSocket = io(SERVER_URL, {
      auth: { username, userId: myId },
    });
    socketRef.current = socket;

    // pahilo patak connect huda, ra network jaayera aayepachi pani chalchha
    socket.on("connect", () => {
      setMessages([]);
      setUsers([]);
      socket.emit("joinRoom", roomRef.current);
    });

    socket.on("connect_error", (err) => {
      // server le reject garyo bhane socket.active false hunchha
      if (!socket.active) onFatalError(err.message);
    });

    // room ma join garda server le purana message pathauchha
    socket.on("history", (old) => {
      setMessages(old.filter((m) => m.room === roomRef.current));
    });

    socket.on("message", (msg) => {
      if (msg.room !== roomRef.current) return;
      setMessages((prev) => [...prev, msg]);
    });

    socket.on("roomUsers", (data) => {
      if (data.room !== roomRef.current) return;
      setUsers(data.users);
    });

    // server ko sandesh (jastai: "Slow down!"), 3 second dekhaune
    socket.on("notice", (text) => {
      setNotice(text);
      setTimeout(() => setNotice(null), 3000);
    });

    return () => {
      socket.disconnect(); // page chhodda connection band
    };
  }, [username, myId, onFatalError]);

  const joinRoom = useCallback((next: string) => {
    if (next === roomRef.current) return;
    roomRef.current = next;
    setRoom(next);
    setMessages([]);
    setUsers([]);
    socketRef.current?.emit("joinRoom", next);
  }, []);

  const sendMessage = useCallback((text: string) => {
    socketRef.current?.emit("chatMessage", text);
  }, []);

  return { myId, room, messages, users, notice, joinRoom, sendMessage };
}
