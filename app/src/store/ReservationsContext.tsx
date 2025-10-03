import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";

export type Reservation = {
  id: string;
  tableNumber: number;
  reservedBy: string;
  date: string; // ISO string
  seats: string[];
};

type ReservationsContextValue = {
  reservations: Reservation[];
  setReservations: React.Dispatch<React.SetStateAction<Reservation[]>>;
};

const ReservationsContext = createContext<ReservationsContextValue | undefined>(undefined);

export const ReservationsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const hasLoadedRef = useRef(false);

  // Load from serverless JSON on first mount
  useEffect(() => {
    if (hasLoadedRef.current) return;
    (async () => {
      try {
        const resp = await fetch("/api/reservations");
        if (resp.ok) {
          const data = await resp.json();
          if (Array.isArray(data)) setReservations(data);
        }
      } catch (_) {
        // ignore fetch error, we'll mark as loaded and allow user to proceed
      } finally {
        hasLoadedRef.current = true; // mark loaded only after GET completes
      }
    })();
  }, []);

  // Save to serverless JSON whenever reservations change (skip if equal to last server value)
  useEffect(() => {
    if (!hasLoadedRef.current) return; // avoid writing before initial GET
    (async () => {
      try {
        await fetch("/api/reservations-save", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(reservations),
        });
      } catch (_) {}
    })();
  }, [reservations]);

  const value = useMemo(() => ({ reservations, setReservations }), [reservations]);

  return (
    <ReservationsContext.Provider value={value}>
      {children}
    </ReservationsContext.Provider>
  );
};

export function useReservations() {
  const ctx = useContext(ReservationsContext);
  if (!ctx) {
    throw new Error("useReservations must be used within ReservationsProvider");
  }
  return ctx;
}


