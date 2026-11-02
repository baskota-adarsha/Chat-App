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

  if (fatalError) {
    return (
      <div className="fatal">
        <p>{fatalError}</p>
        <button onClick={onLeave}>Back</button>
      </div>
    );
  }

  return (
    <main className="chat">
      <header className="chat-header">
        <h2>{room}</h2>
        <button onClick={onLeave}>Leave</button>
      </header>
      <aside className="users">
        <h3>Online Users({users.length})</h3>
        <ul>
          {users.map((user) => (
            <li key={user}>{user}</li>
          ))}
        </ul>
      </aside>

      <MessageList messages={messages} username={username} />
      <MessageInput onSend={sendMessage} />
    </main>
  );
}
