import http from "node:http";
import { Server } from "socket.io";
import { createApp } from "./app.js";
import { env } from "./config/env.js";

const app = createApp();
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: env.FRONTEND_URL, credentials: true }
});

const rooms = new Map<string, { players: Set<string>; scores: Record<string, number> }>();

io.on("connection", (socket) => {
  socket.on("join-room", ({ roomCode, name }: { roomCode: string; name: string }) => {
    socket.join(roomCode);
    const room = rooms.get(roomCode) ?? { players: new Set<string>(), scores: {} };
    room.players.add(socket.id);
    room.scores[socket.id] = room.scores[socket.id] ?? 0;
    rooms.set(roomCode, room);
    io.to(roomCode).emit("room-update", {
      roomCode,
      players: room.players.size,
      scores: room.scores,
      joined: name
    });
  });

  socket.on("score", ({ roomCode, delta }: { roomCode: string; delta: number }) => {
    const room = rooms.get(roomCode);
    if (!room) return;
    room.scores[socket.id] = (room.scores[socket.id] ?? 0) + delta;
    io.to(roomCode).emit("room-update", { roomCode, players: room.players.size, scores: room.scores });
  });

  socket.on("disconnecting", () => {
    for (const roomCode of socket.rooms) {
      const room = rooms.get(roomCode);
      if (!room) continue;
      room.players.delete(socket.id);
      delete room.scores[socket.id];
      io.to(roomCode).emit("room-update", { roomCode, players: room.players.size, scores: room.scores });
    }
  });
});

server.listen(env.PORT, () => {
  console.log(`MathSprint API listening on ${env.PORT}`);
});
