import { useChat } from "../hooks/useChat";
import MessageList from "../components/MessageList";
import MessageInput from "../components/MessageInput";

interface Props {
  username: string;
  onFatalError: (message: string) => void;
}

export default function ChatPage({ username, onFatalError }: Props) {
  const { messages, sendMessage } = useChat(username, onFatalError);

  return (
    <div className="app">
      <main className="chat">
        <header>
          <h2>💬 General</h2>
        </header>
        <MessageList messages={messages} username={username} />
        <MessageInput onSend={sendMessage} />
      </main>
    </div>
  );
}
