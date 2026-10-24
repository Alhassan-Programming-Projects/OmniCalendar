import { useState } from "react";
import { CalendarPlus, ExternalLink, FolderPlus, Share2 } from "lucide-react";
import type { Occurrence } from "@/types";
import { Button, buttonClasses } from "@/components/ui/Button";
import { downloadICS } from "@/lib/ics";
import { useApp } from "@/context/AppContext";
import { CollectionDialog } from "./CollectionDialog";
import { FavoriteButton } from "./FavoriteButton";
import { addDays } from "@/lib/dates";

function gcalDate(d: Date) {
  return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
}

export function shareUrl(id: string) {
  return `${window.location.origin}${(import.meta.env.BASE_URL || "/").replace(/\/$/, "")}/event/${id}`;
}

export function EventActions({ occ }: { occ: Occurrence | null; }) {
  const { notify, collections } = useApp();
  const [open, setOpen] = useState(false);
  if (!occ) return null;
  const e = occ.event;
  const inCollections = collections.filter((c) => c.eventIds.includes(e.id)).length;

  const share = async () => {
    const url = shareUrl(e.id);
    if (navigator.share) {
      try { await navigator.share({ title: e.name, text: e.summary, url }); return; } catch (err) {
        if ((err as DOMException).name === "AbortError") return;
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      notify("Link copied to clipboard");
    } catch {
      window.prompt("Copy this link:", url);
    }
  };

  const gcal = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(e.name)}&dates=${gcalDate(occ.date)}/${gcalDate(addDays(occ.endDate, 1))}&details=${encodeURIComponent(`${e.summary}\n\n${shareUrl(e.id)}`)}`;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <FavoriteButton id={e.id} withLabel />
      <Button variant="outline" onClick={() => setOpen(true)}>
        <FolderPlus /> {inCollections ? `In ${inCollections} collection${inCollections > 1 ? "s" : ""}` : "Add to collection"}
      </Button>
      <Button variant="outline" onClick={() => { downloadICS([occ], e.id); notify("Calendar file downloaded"); }}>
        <CalendarPlus /> Download .ics
      </Button>
      <a href={gcal} target="_blank" rel="noopener noreferrer" className={buttonClasses("outline")}>
        <ExternalLink /> Google Calendar
      </a>
      <Button variant="ghost" onClick={share}><Share2 /> Share</Button>
      <CollectionDialog eventId={e.id} open={open} onClose={() => setOpen(false)} />
    </div>
  );
}
