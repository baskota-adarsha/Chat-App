import type { ChatMessage } from "../types/chat";

interface Props {
  messages: ChatMessage[];
  username: string;
}
export default function MessageList({ messages, username }: Props) {
  return (
    <ul className="messages">
      {messages.map((msg) => (
        <li key={msg.id}>{msg.text}</li>
      ))}
    </ul>
  );
}
