import { Server } from "socket.io";
import type { Server as HttpServer } from "http";
import { isValidNickName } from "./helpers/validate";

export function setupSocket(httpServer: HttpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:5173",
    },
  });

  io.use((socket, next) => {
    const username = String(socket.handshake.auth.username ?? "").trim();
    if (!isValidNickName(username)) {
      next(new Error("Invalid nickname"));
      return;
    }
    socket.data.username = username;
    next();
  });
  io.on("connection", (socket) => {
    console.log(
      `A user connected with username ${socket.data.username}`,
      socket.id,
    );
  });
}
