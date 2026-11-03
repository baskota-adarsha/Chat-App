import { ROOMS } from "../helpers/rooms";
interface Props {
  username: string;
  currentRoom: string;
  users: string[];
  onJoin: (roomId: string) => void;
}
export default function Sidebar({
  username,
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
          <li key={u}>{u === username ? `${u} (you)` : u}</li>
        ))}
      </ul>
    </aside>
  );
}
