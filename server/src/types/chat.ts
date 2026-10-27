export interface ChatMessage {
  id: string;
  room: string;
  from: string;
  text: string;
  time: string;
  system?: boolean;
}
export interface ServerToClientEvents {
  message: (msg: ChatMessage) => void;
  roomUsers: (data: { room: string; users: string[] }) => void;
}
export interface ClientToServerEvents {
  joinRoom: (room: string) => void;
  chatMessage: (text: string) => void;
}

export interface SocketData {
  userName: string;
  room?: string;
}
