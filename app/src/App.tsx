import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import toast, { Toaster } from "react-hot-toast";

// Tip za rezervaciju
type Reservation = {
  id: string;
  tableNumber: number;
  reservedBy: string;
  date: string; // ISO string
  seats: string[];
};

const STORAGE_KEY = "reservations";

// --- App ---
const App: React.FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [name, setName] = useState("");
  const [tableNumber, setTableNumber] = useState<number>(1);
  const [date, setDate] = useState("");
  const [activeTab, setActiveTab] = useState<"tables" | "reserve">("tables");

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed: Reservation[] = JSON.parse(saved);
      const now = new Date();
      const filtered = parsed.filter((res) => new Date(res.date) > now);
      setReservations(filtered);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reservations));
  }, [reservations]);

  const handleReservation = () => {
    if (!name || !date) {
      toast.error("Popuni sva polja!");
      return;
    }

    const newRes: Reservation = {
      id: uuidv4(),
      tableNumber,
      reservedBy: name,
      date,
      seats: [],
    };

    setReservations([...reservations, newRes]);
    setName("");
    setDate("");

    toast.success(`Sto ${tableNumber} rezervisan!`);
  };

  const addSeat = (resId: string, person: string) => {
    setReservations((prev) =>
      prev.map((r) =>
        r.id === resId && r.seats.length < 5
          ? { ...r, seats: [...r.seats, person] }
          : r
      )
    );

    if (person.trim()) toast.success(`${person} dodat u sto!`);
  };

  return (
    <div className="app neon-bg">
      {/* Scoped styles for neon/glass/galaxy theme */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@500;700;800&family=Inter:wght@400;600;800&display=swap');

        :root {
          --bg-1: #070b14;
          --bg-2: #0b1020;
          --card: rgba(255,255,255,0.08);
          --border: rgba(255,255,255,0.18);
          --txt: #e8ecff;
          --muted: #aab4d4;
          --neon-pink: #ff2ea6;
          --neon-cyan: #00e5ff;
          --neon-lime: #9cff57;
          --accent: #7c4dff;
          --success: #34d399;
          --danger: #ff4d6d;
        }

        .neon-bg {
          min-height: 100vh;
          padding: 16px;
          color: var(--txt);
          font-family: 'Inter', system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
          background:
            radial-gradient(1200px 700px at 120% -10%, rgba(124,77,255,0.25), transparent 60%),
            radial-gradient(900px 500px at -10% 110%, rgba(0,229,255,0.18), transparent 60%),
            linear-gradient(180deg, var(--bg-1), var(--bg-2));
          position: relative;
          overflow-x: hidden;
        }

        .neon-bg::before {
          content: '';
          position: absolute;
          inset: -20% -20% -10% -20%;
          background: conic-gradient(from 0deg,
            rgba(255,46,166,0.06), rgba(0,229,255,0.06), rgba(156,255,87,0.06), rgba(255,46,166,0.06));
          filter: blur(60px);
          animation: rotateGlow 20s linear infinite;
          pointer-events: none;
        }

        @keyframes rotateGlow {
          to { transform: rotate(360deg); }
        }

        .container { max-width: 720px; margin: 0 auto; }

        .title {
          font-family: 'Orbitron', sans-serif;
          text-align: center;
          font-size: 1.75rem;
          letter-spacing: 0.02em;
          margin: 6px 0 18px 0;
          text-shadow:
            0 0 10px rgba(0,229,255,0.6),
            0 0 22px rgba(124,77,255,0.35);
        }

        .badge {
          display: inline-block;
          margin: 0 auto 10px auto;
          padding: 6px 12px;
          font-size: 0.75rem;
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 999px;
          background: linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02));
          box-shadow: 0 0 0 1px rgba(124,77,255,0.25) inset;
          color: var(--muted);
          backdrop-filter: blur(8px);
        }

        .glass-card {
          background: linear-gradient(180deg, rgba(255,255,255,0.09), rgba(255,255,255,0.04));
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 14px;
          box-shadow:
            0 8px 28px rgba(0,0,0,0.35),
            0 0 0 1px rgba(255,255,255,0.06) inset,
            0 0 24px rgba(124,77,255,0.25);
          backdrop-filter: blur(14px) saturate(120%);
          overflow: hidden;
        }

        .form-grid { display: grid; gap: 10px; }

        .label { font-size: 0.8rem; color: var(--muted); margin: 4px 0 2px; }

        .input-glass {
          width: 100%;
          padding: 12px 14px;
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.18);
          background: linear-gradient(180deg, rgba(14,17,27,0.55), rgba(14,17,27,0.35));
          color: var(--txt);
          outline: none;
          transition: border-color .2s ease, box-shadow .2s ease, transform .05s ease;
          box-shadow: 0 6px 18px rgba(0,0,0,0.35) inset;
          box-sizing: border-box;
        }
        /* Better calendar look */
        .input-glass::-webkit-calendar-picker-indicator {
          filter: invert(1) drop-shadow(0 0 6px rgba(0,229,255,0.8));
          cursor: pointer;
        }
        .input-glass[type="datetime-local"]::-webkit-datetime-edit-year-field,
        .input-glass[type="datetime-local"]::-webkit-datetime-edit-month-field,
        .input-glass[type="datetime-local"]::-webkit-datetime-edit-day-field,
        .input-glass[type="datetime-local"]::-webkit-datetime-edit-hour-field,
        .input-glass[type="datetime-local"]::-webkit-datetime-edit-minute-field {
          color: var(--txt);
        }
        .input-glass[type="datetime-local"]::-webkit-datetime-edit-text { color: #7b86a8; }

        /* Tabs */
        .tabs { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin: 8px 0 14px; }
        .tab {
          padding: 10px 12px;
          border-radius: 12px;
          border: 1px solid rgba(0,229,255,0.3);
          background: linear-gradient(180deg, rgba(0,229,255,0.18), rgba(124,77,255,0.12));
          color: var(--txt);
          font-weight: 800;
          letter-spacing: .02em;
          text-transform: uppercase;
          box-shadow: 0 6px 16px rgba(0,0,0,0.35);
          transition: filter .2s ease, transform .12s ease, box-shadow .2s ease;
        }
        .tab:hover { filter: brightness(1.06); box-shadow: 0 10px 22px rgba(124,77,255,0.35); }
        .tab:active { transform: translateY(1px); }
        .tab.active {
          background: linear-gradient(90deg, rgba(0,229,255,0.9), rgba(124,77,255,0.9));
          color: #001218;
          border-color: rgba(0,229,255,0.6);
        }

        .input-glass::placeholder { color: #7b86a8; }
        .input-glass:focus {
          border-color: rgba(0,229,255,0.6);
          box-shadow: 0 0 0 3px rgba(0,229,255,0.25);
        }

        .btn-neon {
          width: 100%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px 16px;
          border-radius: 12px;
          border: 1px solid rgba(0,229,255,0.4);
          color: #001218;
          background:
            linear-gradient(90deg, rgba(0,229,255,1), rgba(124,77,255,1));
          box-shadow:
            0 8px 22px rgba(0,229,255,0.35),
            0 0 18px rgba(124,77,255,0.35);
          font-weight: 700;
          letter-spacing: 0.02em;
          text-transform: uppercase;
          transition: transform .12s ease, filter .2s ease, box-shadow .2s ease;
        }

        .btn-neon:active { transform: translateY(1px) scale(0.995); }
        .btn-neon:hover {
          filter: brightness(1.05) saturate(1.1);
          box-shadow:
            0 10px 26px rgba(0,229,255,0.45),
            0 0 28px rgba(124,77,255,0.45);
        }

        .list { display: grid; gap: 12px; }

        .res-header { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
        .res-title { font-weight: 800; font-size: 1rem; }
        .res-title .who { color: var(--success); text-shadow: 0 0 12px rgba(52,211,153,0.4); }
        .res-date { color: var(--muted); font-size: 0.82rem; }

        .table-neon {
          width: 100%;
          border-collapse: collapse;
          margin-top: 8px;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 0 0 1px rgba(255,255,255,0.08) inset, 0 8px 24px rgba(0,0,0,0.35);
        }
        .table-neon th, .table-neon td {
          border: 1px solid rgba(255,255,255,0.12);
          padding: 8px;
        }
        .table-neon thead th {
          background: linear-gradient(180deg, rgba(255,255,255,0.12), rgba(255,255,255,0.04));
          color: var(--muted);
          font-weight: 600;
          text-align: left;
        }
        .table-neon tbody tr:hover td { background: rgba(124,77,255,0.07); }

        .row { display: grid; grid-template-columns: 1fr auto; gap: 8px; margin-top: 10px; }
        .btn-secondary {
          padding: 10px 14px;
          border-radius: 12px;
          border: 1px solid rgba(124,77,255,0.35);
          background: linear-gradient(180deg, rgba(124,77,255,0.9), rgba(124,77,255,0.65));
          color: white;
          font-weight: 700;
          letter-spacing: .02em;
          box-shadow: 0 8px 22px rgba(124,77,255,0.35);
          transition: transform .12s ease, filter .2s ease, box-shadow .2s ease;
        }
        .btn-secondary:hover { filter: brightness(1.05); box-shadow: 0 10px 28px rgba(124,77,255,0.5); }
        .btn-secondary:active { transform: translateY(1px) scale(0.995); }

        .divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent);
          margin: 10px 0;
        }

        .toast-neon {
          border: 1px solid rgba(255,255,255,0.18) !important;
          background: rgba(14,17,27,0.7) !important;
          color: var(--txt) !important;
          backdrop-filter: blur(10px) !important;
          box-shadow: 0 8px 28px rgba(0,0,0,0.35), 0 0 18px rgba(0,229,255,0.3) !important;
        }

        @media (min-width: 640px) {
          .title { font-size: 2.1rem; }
          .form-grid { grid-template-columns: 1fr 1fr; }
          .form-grid .full { grid-column: 1 / -1; }
        }
      `}</style>

      <Toaster
        position="top-center"
        toastOptions={{
          className: "toast-neon",
          style: { borderRadius: 12, padding: 12, fontWeight: 600 },
          success: { iconTheme: { primary: "#34d399", secondary: "#001b14" } },
          error: { iconTheme: { primary: "#ff4d6d", secondary: "#28000a" } },
        }}
      />

      <div className="container">
        <h1 className="title">🎲 Arena Stolovi</h1>

        {/* Tabs */}
        <div className="tabs">
          <button
            className={`tab ${activeTab === "tables" ? "active" : ""}`}
            onClick={() => setActiveTab("tables")}
          >
            Stolovi
          </button>
          <button
            className={`tab ${activeTab === "reserve" ? "active" : ""}`}
            onClick={() => setActiveTab("reserve")}
          >
            Rezervacija
          </button>
        </div>

        {activeTab === "reserve" && (
          <div className="glass-card" style={{ margin: "0 auto 14px auto" }}>
            <h2
              style={{
                fontSize: "1.05rem",
                margin: "4px 0 8px",
                fontWeight: 800,
              }}
            >
              Nova rezervacija
            </h2>
            <div className="form-grid">
              <div className="full">
                <div className="label">Tvoje ime</div>
                <input
                  className="input-glass"
                  type="text"
                  placeholder="Unesi ime"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <div className="label">Broj stola</div>
                <input
                  className="input-glass"
                  type="number"
                  min={1}
                  placeholder="npr. 3"
                  value={tableNumber}
                  onChange={(e) => setTableNumber(Number(e.target.value))}
                />
              </div>
              <div>
                <div className="label">Datum i vreme</div>
                <input
                  className="input-glass"
                  type="datetime-local"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
              <div className="full" style={{ marginTop: 4 }}>
                <button className="btn-neon" onClick={handleReservation}>
                  <span>Rezerviši sto</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "tables" && (
          <div className="list">
            {reservations.map((res) => (
              <div key={res.id} className="glass-card">
                <div className="res-header">
                  <div>
                    <div className="res-title">
                      Sto {res.tableNumber} –{" "}
                      <span className="who">{res.reservedBy}</span>
                    </div>
                    <div className="res-date">
                      📅 {new Date(res.date).toLocaleString()}
                    </div>
                  </div>
                </div>

                <div className="divider" />

                <table className="table-neon">
                  <thead>
                    <tr>
                      <th style={{ width: 72 }}>Mesto</th>
                      <th>Ime</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i}>
                        <td style={{ textAlign: "center", fontWeight: 700 }}>
                          {i + 1}
                        </td>
                        <td>{res.seats[i] || ""}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {res.seats.length < 5 && (
                  <SeatForm resId={res.id} addSeat={addSeat} />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Forma za dodavanje osobe u sto
const SeatForm: React.FC<{
  resId: string;
  addSeat: (id: string, person: string) => void;
}> = ({ resId, addSeat }) => {
  const [person, setPerson] = useState("");

  const handleAdd = () => {
    if (person.trim()) {
      addSeat(resId, person.trim());
      setPerson("");
    } else {
      toast.error("Unesi ime osobe!");
    }
  };

  return (
    <div className="row">
      <input
        className="input-glass"
        type="text"
        placeholder="Ime osobe"
        value={person}
        onChange={(e) => setPerson(e.target.value)}
      />
      <button className="btn-secondary" onClick={handleAdd}>
        Dodaj
      </button>
    </div>
  );
};

export default App;
