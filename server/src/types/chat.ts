export interface ChatMessage {
  id: string;
  room: string;
  from: string;
  fromId: string;
  text: string;
  time: string;
  system?: boolean;
}

export interface RoomUser {
  id: string;
  name: string;
}

export interface ServerToClientEvents {
  message: (msg: ChatMessage) => void;
  history: (messages: ChatMessage[]) => void;
  roomUsers: (data: { room: string; users: RoomUser[] }) => void;
  notice: (text: string) => void;
}
export interface ClientToServerEvents {
  joinRoom: (room: string) => void;
  chatMessage: (text: string) => void;
}

export interface SocketData {
  userName: string;
  userId: string;
  room?: string;
}
