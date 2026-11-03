import { useChat } from "../hooks/useChat";
import MessageList from "../components/MessageList";
import MessageInput from "../components/MessageInput";
import Sidebar from "../components/Sidebar";
import { ROOMS } from "../helpers/rooms";
interface Props {
  username: string;
  onFatalError: (message: string) => void;
}

export default function ChatPage({ username, onFatalError }: Props) {
  const { room, messages, sendMessage, users, joinRoom } = useChat(
    username,
    onFatalError,
  );

  const title = ROOMS.find((r) => r.id === room)?.label ?? room;
  return (
    <div className="app">
      <Sidebar
        username={username}
        currentRoom={room}
        users={users}
        onJoin={joinRoom}
      />
      <main className="chat">
        <header>
          <h2>{title}</h2>
        </header>
        <MessageList messages={messages} username={username} />
        <MessageInput onSend={sendMessage} />
      </main>
    </div>
  );
}
