import React, { createContext, useContext, useMemo, useState } from "react";

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


