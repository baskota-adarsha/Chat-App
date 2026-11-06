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
  const { myId, room, messages, sendMessage, users, joinRoom, notice } =
    useChat(username, onFatalError);

  const title = ROOMS.find((r) => r.id === room)?.label ?? room;
  return (
    <div className="app">
      <Sidebar
        username={username}
        myId={myId}
        currentRoom={room}
        users={users}
        onJoin={joinRoom}
      />
      <main className="chat">
        <header>
          <h2>{title}</h2>
        </header>
        <MessageList messages={messages} myId={myId} />
        {notice && <p className="notice">{notice}</p>}
        <MessageInput onSend={sendMessage} />
      </main>
    </div>
  );
}
