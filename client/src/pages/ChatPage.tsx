import MessageList from "../components/MessageList";
import MessageInput from "../components/MessageInput";
import { useChat } from "../hooks/useChat";
import { useState } from "react";

interface Props {
  username: string;
  onLeave: () => void;
}

export default function ChatPage({ username, onLeave }: Props) {
  const [fatalError, setFatalError] = useState<string | null>(null);

  const { room, messages, users, joinRoom, sendMessage } = useChat(
    username,
    (message) => setFatalError(message),
  );
}
