import type { ChatMessage } from "../types/chat";
import { useEffect, useRef } from "react";
interface Props {
  messages: ChatMessage[];
  myId: string;
}

export default function MessageList({ messages, myId }: Props) {
  const bottomRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
            className={msg.fromId === myId ? "bubble mine" : "bubble"}
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

      <li ref={bottomRef} />
    </ul>
  );
}
