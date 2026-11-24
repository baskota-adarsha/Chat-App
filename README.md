# ChatApp 🐣

A small real-time chat app with rooms. Node.js + Express + Socket.io on the server, React + TypeScript (Vite) on the client.

## Features

- Pick a nickname; two people can use the same nickname (each browser tab has its own hidden id, so messages are never mixed up)
- Join rooms (General, Coding, Music); messages only reach people in the same room
- Live "online here" list for each room, plus join and leave notices
- The last 10 messages of a room are shown when you join, so it is never empty (kept in memory)
- Rate limiting: at most 5 messages every 10 seconds per user
- Typed socket events shared by client and server
- ESLint, Prettier, Husky and lint-staged keep every commit clean

## Setup

0. Install the repo tools (this also sets up the Git hooks)
   ```bash
   npm install
   ```

You need Node.js 20 or newer.

1. Start the server

   ```bash
   cd server
   npm install
   npm run dev
   ```

   It runs on http://localhost:3001

2. In a second terminal, start the client
   ```bash
   cd client
   npm install
   npm run dev
   ```
   Open http://localhost:5173 in two browser windows (one normal, one incognito) and chat between them.

## Scripts

| Folder | Script                        | What it does                             |
| ------ | ----------------------------- | ---------------------------------------- |
| server | `npm run dev`                 | Start with auto-reload                   |
| server | `npm run build` / `npm start` | Compile and run the build                |
| client | `npm run dev`                 | Start the Vite dev server                |
| client | `npm run build`               | Production build                         |
| root   | `npm run lint`                | Check server and client code with ESLint |
| root   | `npm run format`              | Format code with Prettier                |

## How it works

1. The nickname page checks the nickname, then the chat page opens a Socket.io connection and sends the nickname in `auth`.
2. **Socket.io middleware** (`io.use`) runs for every new connection. It validates the nickname and rejects duplicates.
3. Joining a room uses `socket.join(room)`. Messages use `io.to(room).emit(...)`, so only people in that room receive them.
4. The React hook `useChat` holds all the socket logic. Components only display data and call functions.
5. The server keeps the last 10 messages of each room and sends them to anyone who joins.
6. A sliding-window rate limiter blocks a user who sends more than 5 messages in 10 seconds and shows them a short notice.

## Project structure

```
server/src
  config/      room list
  helpers/     nickname validation
  types/       typed socket events
  socket.ts    all Socket.io logic
  index.ts     Express server
client/src
  pages/       NamePage, ChatPage
  components/  Sidebar, MessageList, MessageInput
  hooks/       useChat
  helpers/     validation, room list
  types/       typed socket events
```

## Notes

- Messages are kept only while the server is running (no database).
- The room list is defined in `server/src/config/rooms.ts` and `client/src/helpers/rooms.ts`. Keep them the same.

## Ideas for later

- Save messages in a database
- "X is typing..." indicator
- Message history when joining a room
