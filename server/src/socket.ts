import { Server as HttpServer } from "http";
import { randomUUID } from "crypto";
import { Server } from "socket.io";
import { ROOMS } from "./config/rooms";
// import { isValidNickname } from "./helpers/validate";
import { isValidNickName } from "./helpers/validate";
import { createRateLimiter } from "./helpers/rateLimit"; // NEW

import type {
  ChatMessage,
  ClientToServerEvents,
  RoomUser,
  ServerToClientEvents,
  SocketData,
} from "./types/chat";
import { addToHistory, getHistory } from "./services/history.service";

export function setupSocket(httpServer: HttpServer) {
  const io = new Server<
    ClientToServerEvents,
    ServerToClientEvents,
    Record<string, never>,
    SocketData
  >(httpServer, { cors: { origin: "http://localhost:5173" } });

  const makeMessage = (
    room: string,
    from: string,
    fromId: string,
    text: string,
    system = false,
  ): ChatMessage => ({
    id: randomUUID(),
    room,
    from,
    fromId,
    text,
    time: new Date().toISOString(),
    system,
  });

  const systemMessage = (room: string, text: string): ChatMessage =>
    makeMessage(room, "system", "system", text, true);

  // Room ma ko ko chha, tyo sabai lai pathaune (userId anusar, duplicate hataera)
  const sendUsers = async (room: string) => {
    const sockets = await io.in(room).fetchSockets();
    const unique = new Map<string, RoomUser>();
    for (const s of sockets) {
      unique.set(s.data.userId, { id: s.data.userId, name: s.data.userName });
    }
    io.to(room).emit("roomUsers", { room, users: [...unique.values()] });
  };

  // SOCKET MIDDLEWARE: har naya connection ma, "connection" event aghi chalchha
  io.use((socket, next) => {
    const userName = String(socket.handshake.auth.userName ?? "").trim();
    const userId = String(socket.handshake.auth.userId ?? "").trim();

    if (!isValidNickName(userName)) {
      next(new Error("Invalid nickname"));
      return;
    }
    if (userId.length < 8 || userId.length > 64) {
      next(new Error("Invalid user id"));
      return;
    }

    // naam same huna sakchha, tara userId le chinchha
    socket.data.userName = userName;
    socket.data.userId = userId;
    next();
  });

  io.on("connection", (socket) => {
    console.log(`${socket.data.userName} connected`);

    // NEW: yo user ko afno limiter, 10 second ma 5 message matra
    const allowMessage = createRateLimiter(5, 10_000);

    socket.on("joinRoom", async (room) => {
      if (!ROOMS.some((r) => r.id === room)) return;
      if (socket.data.room === room) return;

      // purano room chhodne
      const old = socket.data.room;
      if (old) {
        await socket.leave(old);
        io.to(old).emit(
          "message",
          systemMessage(old, `${socket.data.userName} left the room`),
        );
        await sendUsers(old);
      }

      // naya room ma jodine
      await socket.join(room);
      socket.data.room = room;

      // naya manche lai last 10 message dine
      socket.emit("history", getHistory(room));

      io.to(room).emit(
        "message",
        systemMessage(room, `${socket.data.userName} joined the room`),
      );
      await sendUsers(room);
    });

    socket.on("chatMessage", (text) => {
      const room = socket.data.room;
      const clean = String(text ?? "")
        .trim()
        .slice(0, 500);
      if (!room || !clean) return;

      // NEW: limit pugyo bhane message nafelne, user lai sandesh dine
      if (!allowMessage()) {
        socket.emit(
          "notice",
          "Slow down! You can send 5 messages every 10 seconds.",
        );
        return;
      }

      const msg = makeMessage(
        room,
        socket.data.userName,
        socket.data.userId,
        clean,
      );
      addToHistory(msg);
      io.to(room).emit("message", msg);
    });

    socket.on("disconnect", async () => {
      console.log(`${socket.data.userName} left`);
      const room = socket.data.room;
      if (!room) return;

      io.to(room).emit(
        "message",
        systemMessage(room, `${socket.data.userName} went offline`),
      );
      await sendUsers(room);
    });
  });
}
