import { ROOMS } from "../helpers/rooms";
import type { RoomUser } from "../types/chat";
interface Props {
  username: string;
  myId: string;
  currentRoom: string;
  users: RoomUser[];
  onJoin: (roomId: string) => void;
}
export default function Sidebar({
  username,
  myId,
  currentRoom,
  users,
  onJoin,
}: Props) {
  return (
    <aside className="sidebar">
      <h2> Chat App</h2>
      <p>
        {" "}
        Hi, <strong>{username}</strong>
      </p>

      <h3>Rooms</h3>
      <ul>
        {ROOMS.map((room) => (
          <li key={room.id}>
            <button
              className={room.id === currentRoom ? "room active" : "room"}
              onClick={() => onJoin(room.id)}
            >
              {room.label}
            </button>
          </li>
        ))}
      </ul>

      <h3>Online here</h3>
      <ul className="users">
        {users.map((u: any) => (
          <li key={u.id}>{u.id === myId ? `${u.name} (you)` : u.name}</li>
        ))}
      </ul>
    </aside>
  );
}
