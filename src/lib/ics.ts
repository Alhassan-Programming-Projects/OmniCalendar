import type { Occurrence } from "@/types";
import { addDays } from "./dates";
import { RECOGNITION_MAP } from "@/data/categories";

function ymd(d: Date): string {
  return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
}

function escapeText(s: string): string {
  return s.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");
}

/** RFC 5545 line folding at 75 octets (approximated with UTF-16 length, safe for ASCII-heavy text). */
function fold(line: string): string {
  const out: string[] = [];
  let rest = line;
  const encoder = new TextEncoder();
  while (encoder.encode(rest).length > 75) {
    let cut = Math.min(rest.length, 75);
    while (encoder.encode(rest.slice(0, cut)).length > (out.length ? 74 : 75)) cut--;
    out.push(rest.slice(0, cut));
    rest = rest.slice(cut);
  }
  out.push(rest);
  return out.map((l, i) => (i === 0 ? l : " " + l)).join("\r\n");
}

function stamp(): string {
  return new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

/** Build an iCalendar file with one all-day VEVENT per occurrence. */
export function buildICS(occurrences: Occurrence[], baseUrl: string): string {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//OmniCalendar//Every Day Has a Story//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "X-WR-CALNAME:OmniCalendar",
  ];
  const now = stamp();
  for (const o of occurrences) {
    const url = `${baseUrl}/event/${o.event.id}`;
    const desc = [
      o.event.summary,
      "",
      `${RECOGNITION_MAP[o.event.recognition].label}`,
      o.estimated ? "Date is an estimate and may shift by a day." : "",
      url,
    ].filter(Boolean).join("\n");
    lines.push(
      "BEGIN:VEVENT",
      `UID:${o.event.id}-${ymd(o.date)}@omnicalendar`,
      `DTSTAMP:${now}`,
      `DTSTART;VALUE=DATE:${ymd(o.date)}`,
      `DTEND;VALUE=DATE:${ymd(addDays(o.endDate, 1))}`,
      `SUMMARY:${escapeText(o.event.name)}`,
      `DESCRIPTION:${escapeText(desc)}`,
      `URL:${url}`,
      "TRANSP:TRANSPARENT",
      "END:VEVENT",
    );
  }
  lines.push("END:VCALENDAR");
  return lines.map(fold).join("\r\n") + "\r\n";
}

export function downloadICS(occurrences: Occurrence[], filename: string) {
  const base = window.location.origin + (import.meta.env.BASE_URL || "/").replace(/\/$/, "");
  const blob = new Blob([buildICS(occurrences, base)], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename.endsWith(".ics") ? filename : `${filename}.ics`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
