import { useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { EVENTS } from "@/data/events";
import { useApp } from "@/context/AppContext";
import { nextOccurrence } from "@/lib/dates";

/** Navigate to a random special day that still has an upcoming (or current) date. */
export function useSurprise() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { today } = useApp();
  return useCallback(() => {
    const current = pathname.startsWith("/event/") ? pathname.slice(7) : "";
    const pool = EVENTS.filter((e) => e.id !== current && nextOccurrence(e, today));
    const pick = pool[Math.floor(Math.random() * pool.length)];
    navigate(`/event/${pick.id}?surprise=1`);
  }, [navigate, pathname, today]);
}
