import { Server } from "socket.io";
import type { Server as HttpServer } from "http";
import { isValidNickName } from "./helpers/validate";
import { ROOMS } from "./config/rooms";
export function setupSocket(httpServer: HttpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:5173",
    },
  });

  const sendUsers = async (room: string) => {
    const sockets = await io.in(room).fetchSockets();
    io.to(room).emit("roomUsers", {
      room,
      users: sockets.map((s) => s.data.username),
    });
  };

  io.use((socket, next) => {
    const username = String(socket.handshake.auth.username ?? "").trim();
    if (!isValidNickName(username)) {
      next(new Error("Invalid nickname"));
      return;
    }

    const taken = [...io.sockets.sockets.values()].some(
      (s) => s.data.userName === username,
    );
    if (taken) {
      next(new Error("Username already used"));
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

    socket.on("joinRoom", async (room) => {
      if (!ROOMS.some((r) => r.id === room)) return;
      if (socket.data.room === room) return;

      const old = socket.data.room;
      if (old) {
        await socket.leave(old);
        console.log(`${socket.data.username} left room ${old}`);

        io.to(old).emit("message", `${socket.data.username} left the room`);
        await sendUsers(old);
      }
      await socket.join(room);

      socket.data.room = room;
    });
  });
}
