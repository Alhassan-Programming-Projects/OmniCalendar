import { useState } from "react";
import { Check, FolderPlus, Plus } from "lucide-react";
import { Dialog } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { useApp } from "@/context/AppContext";
import { cn } from "@/lib/utils";

export function CollectionDialog({ eventId, open, onClose }: { eventId: string; open: boolean; onClose: () => void }) {
  const { collections, createCollection, toggleInCollection, notify } = useApp();
  const [name, setName] = useState("");
  return (
    <Dialog open={open} onClose={onClose} title="Add to collection" description="Group special days into your own personal collections.">
      <ul className="max-h-64 space-y-1 overflow-y-auto">
        {collections.length === 0 && <li className="py-3 text-sm text-muted">No collections yet — create your first one below.</li>}
        {collections.map((c) => {
          const has = c.eventIds.includes(eventId);
          return (
            <li key={c.id}>
              <button
                type="button"
                onClick={() => { toggleInCollection(c.id, eventId); notify(has ? `Removed from “${c.name}”` : `Added to “${c.name}”`); }}
                aria-pressed={has}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left hover:bg-surface-2"
              >
                <span className={cn("grid size-5 place-items-center rounded-md border", has ? "border-primary bg-primary text-primary-fg" : "border-border")}>
                  {has && <Check className="size-3.5" aria-hidden />}
                </span>
                <span className="flex-1 font-medium">{c.name}</span>
                <span className="text-xs text-muted">{c.eventIds.length}</span>
              </button>
            </li>
          );
        })}
      </ul>
      <form
        className="mt-4 flex gap-2 border-t border-border pt-4"
        onSubmit={(e) => {
          e.preventDefault();
          if (!name.trim()) return;
          const c = createCollection(name, eventId);
          notify(`Created “${c.name}”`);
          setName("");
        }}
      >
        <label htmlFor="new-collection" className="sr-only">New collection name</label>
        <div className="relative flex-1">
          <FolderPlus className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden />
          <input
            id="new-collection"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Family birthdays & holidays"
            maxLength={60}
            className="h-10 w-full rounded-full border border-border bg-surface-2 pl-9 pr-3 text-sm outline-none focus:border-primary"
          />
        </div>
        <Button type="submit" disabled={!name.trim()}><Plus /> Create</Button>
      </form>
    </Dialog>
  );
}
