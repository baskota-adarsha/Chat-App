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
          <li
            key={msg.id}
            className={msg.from === username ? "bubble mine" : "bubble"}
          >
            <span className="name">{msg.from}</span>
            <p> {msg.text}</p>
            <small>
              {new Date(msg.time).toLocaleDateString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </small>
          </li>
        ),
      )}
    </ul>
  );
}
