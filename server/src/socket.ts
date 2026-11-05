import { Server } from "socket.io";
import type { Server as HttpServer } from "http";
import { isValidNickName } from "./helpers/validate";
import { ROOMS } from "./config/rooms";
import { randomUUID } from "crypto";
import { ChatMessage, RoomUser } from "./types/chat";
export function setupSocket(httpServer: HttpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:5173",
    },
  });
  const makeMessage = (
    room: string,
    from: string,
    fromId: string,
    text: string,
    system = false,
  ): ChatMessage => {
    return {
      id: randomUUID(),
      room,
      from,
      fromId,
      text,
      time: new Date().toISOString(),
      system,
    };
  };

  const systemMessage = (room: string, text: string): ChatMessage => {
    return makeMessage(room, "system", "system", text, true);
  };

  const sendUsers = async (room: string) => {
    const sockets = await io.in(room).fetchSockets();
    const unique = new Map<string, RoomUser>();
    for (const s of sockets) {
      unique.set(s.data.userId, { id: s.data.userId, name: s.data.username });
    }
    io.to(room).emit("roomUsers", {
      room,
      users: [...unique.values()],
    });
  };

  io.use((socket, next) => {
    const username = String(socket.handshake.auth.username ?? "").trim();
    const userId = String(socket.handshake.auth.userId ?? "").trim();
    if (!isValidNickName(username)) {
      next(new Error("Invalid nickname"));
      return;
    }
    if (userId.length < 8 || userId.length > 64) {
      next(new Error("Invalid user id"));
      return;
    }

    socket.data.username = username;
    socket.data.userId = userId;
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

        io.to(old).emit(
          "message",
          systemMessage(old, `${socket.data.username} left the room`),
        );
        await sendUsers(old);
      }
      await socket.join(room);

      socket.data.room = room;

      io.to(room).emit(
        "message",
        systemMessage(room, `${socket.data.username} joined the room`),
      );
      await sendUsers(room);
    });
    socket.on("chatMessage", (text) => {
      const room = socket.data.room;

      const clean = String(text ?? "")
        .trim()
        .slice(0, 500);

      if (!room || !clean) return;
      const msg = makeMessage(
        room,
        socket.data.username,
        socket.data.userId,
        clean,
      );
      io.to(room).emit("message", msg);
    });

    socket.on("disconnect", async () => {
      console.log(`${socket.data.username} disconnected`);

      const room = socket.data.room;
      if (!room) return;
      io.to(room).emit(
        "message",
        systemMessage(room, `${socket.data.username} went offline`),
      );
      await sendUsers(room);
    });
  });
}
