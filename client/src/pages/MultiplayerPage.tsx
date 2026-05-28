import { Gamepad2 } from "lucide-react";
import { useMemo, useState } from "react";
import { io } from "socket.io-client";
import { apiUrl } from "../api/client";
import { useAuth } from "../components/AuthProvider";
import { ScorePill } from "../components/ScorePill";

export function MultiplayerPage() {
  const { user } = useAuth();
  const [roomCode, setRoomCode] = useState("MATH-1");
  const [joined, setJoined] = useState(false);
  const [room, setRoom] = useState<{ players: number; scores: Record<string, number> }>({ players: 0, scores: {} });
  const socket = useMemo(() => io(apiUrl("").replace(/\/$/, ""), { autoConnect: false }), []);

  function join() {
    socket.connect();
    socket.emit("join-room", { roomCode, name: user?.name ?? "Student" });
    socket.on("room-update", (update) => setRoom({ players: update.players, scores: update.scores }));
    setJoined(true);
  }

  function score(delta: number) {
    socket.emit("score", { roomCode, delta });
  }

  return (
    <main className="page">
      <section className="section-heading">
        <span className="eyebrow">Live multiplayer</span>
        <h1><Gamepad2 size={36} /> Practice room</h1>
      </section>
      <section className="multiplayer-panel">
        <input value={roomCode} onChange={(e) => setRoomCode(e.target.value.toUpperCase())} disabled={joined} />
        {!joined ? <button className="primary-button" onClick={join}>Join room</button> : <button className="primary-button" onClick={() => score(1)}>Add live point</button>}
      </section>
      <div className="score-grid">
        <ScorePill label="Players" value={room.players} />
        <ScorePill label="Room" value={roomCode} />
        <ScorePill label="Total points" value={Object.values(room.scores).reduce((a, b) => a + b, 0)} />
      </div>
      <section className="recent-panel">
        <h2>Live scores</h2>
        {Object.entries(room.scores).map(([id, value]) => <div className="activity-row" key={id}><span>{id.slice(0, 8)}</span><strong>{value}</strong></div>)}
      </section>
    </main>
  );
}
