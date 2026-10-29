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
  roomUsers: (data: { room: string; user: string[] }) => void;
}

export interface ClientToServerEvents {
  joinRoom: (room: string) => void;
  chatMessage: (text: string) => void;
}
