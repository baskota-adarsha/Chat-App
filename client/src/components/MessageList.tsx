import type { ChatMessage } from "../types/chat";

interface Props {
  messages: ChatMessage[];
  username: string;
}

export default function MessageList({ messages, username }: Props) {
  return (
    <ul className="messages">
      {messages.map((msg) =>
        msg.system ? (
          <li key={msg.id} className="system">
            {msg.text}
          </li>
        ) : (
          <li key={msg.id} className="bubble">
            {msg.text}
          </li>
        ),
      )}
    </ul>
  );
}
