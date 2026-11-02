import MessageList from "../components/MessageList";
import MessageInput from "../components/MessageInput";
import { useChat } from "../hooks/useChat";
import { useState } from "react";

interface Props {
  username: string;
  onLeave: () => void;
}

export default function ChatPage({ username, onLeave }: Props);
