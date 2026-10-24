import { useEffect } from "react";

export function useDocumentTitle(title?: string) {
  useEffect(() => {
    document.title = title ? `${title} · OmniCalendar` : "OmniCalendar — Every Day Has a Story";
  }, [title]);
}
