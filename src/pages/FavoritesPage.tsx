import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Check, Download, FolderOpen, FolderPlus, Heart, Pencil, Trash2, X } from "lucide-react";
import { EVENT_MAP } from "@/data/events";
import { useApp } from "@/context/AppContext";
import { formatLong, nextOccurrence } from "@/lib/dates";
import { downloadICS } from "@/lib/ics";
import { CategoryIcon } from "@/components/events/Badges";
import { Countdown } from "@/components/events/Countdown";
import { EventRow } from "@/components/events/EventCard";
import { FavoriteButton } from "@/components/events/FavoriteButton";
import { Button, buttonClasses } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import { PageHeader } from "@/components/ui/PageHeader";
import { CATEGORY_MAP } from "@/data/categories";
import { EmptyState } from "@/components/ui/EmptyState";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { cn, pluralize } from "@/lib/utils";
import type { Collection, Occurrence } from "@/types";

function toOccurrences(ids: string[], today: Date) {
  return ids.map((id) => EVENT_MAP[id] && nextOccurrence(EVENT_MAP[id], today)).filter((o): o is Occurrence => !!o)
    .sort((a, b) => a.date.getTime() - b.date.getTime());
}

export default function FavoritesPage() {
  useDocumentTitle("Favorites");
  const { favorites, collections, today, notify } = useApp();
  const [params, setParams] = useSearchParams();
  const tab = params.get("tab") === "collections" ? "collections" : "favorites";
  const favOcc = useMemo(() => toOccurrences(favorites, today), [favorites, today]);
  const pastCount = favorites.filter((id) => EVENT_MAP[id]).length - favOcc.length;

  return (
    <div>
      <PageHeader eyebrow="Saved" title="Your special days" description="Saved in this browser only — nothing leaves your device.">
      <div className="segmented mt-6" role="tablist" aria-label="Saved items">
        {([["favorites", `Favorites (${favorites.length})`], ["collections", `Collections (${collections.length})`]] as const).map(([id, label]) => (
          <button key={id} role="tab" id={`tab-${id}`} aria-selected={tab === id} aria-controls={`panel-${id}`}
            onClick={() => setParams(id === "favorites" ? {} : { tab: id }, { replace: true })}
            className="segmented-item">
            {label}
          </button>
        ))}
      </div>
      </PageHeader>
      <div className="container-page pb-4">

      {tab === "favorites" ? (
        <div role="tabpanel" id="panel-favorites" aria-labelledby="tab-favorites" className="mt-8 animate-fade-in">
          {favOcc.length === 0 ? (
            <EmptyState icon={Heart} title="No favorites yet">
              <p>Tap the heart on any special day and it will appear here with a countdown.</p>
              <Link to="/explore" className={buttonClasses("primary", "md", "mt-5")}>Explore special days</Link>
            </EmptyState>
          ) : (
            <>
              <div className="mb-4 flex flex-wrap items-center gap-3">
                <p className="mr-auto text-sm text-muted">Sorted by how soon they come around{pastCount > 0 && ` · ${pastCount} past one-time ${pastCount === 1 ? "event" : "events"} hidden`}.</p>
                <Button variant="outline" size="sm" onClick={() => { downloadICS(favOcc, "omnicalendar-favorites"); notify(`Exported ${pluralize(favOcc.length, "favorite")}`); }}>
                  <Download /> Export all (.ics)
                </Button>
              </div>
              <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {favOcc.map((o) => (
                  <li key={o.event.id} className="card card-interactive group relative flex flex-col gap-3 overflow-hidden p-5">
                    <span className={cn("card-tab", CATEGORY_MAP[o.event.category].dot)} aria-hidden />
                    <div className="flex items-start gap-3">
                      <CategoryIcon id={o.event.category} size="sm" />
                      <Link to={`/event/${o.event.id}`} className="flex-1 font-semibold leading-snug hover:text-primary">{o.event.name}</Link>
                      <FavoriteButton id={o.event.id} className="-mr-2 -mt-1" />
                    </div>
                    <Countdown occ={o} />
                    <p className="border-t border-border/50 pt-3 text-xs text-muted">{formatLong(o.date)}{o.estimated && " · estimated"}</p>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      ) : (
        <div role="tabpanel" id="panel-collections" aria-labelledby="tab-collections" className="mt-8 animate-fade-in">
          <Collections />
        </div>
      )}
      </div>
    </div>
  );
}

function Collections() {
  const { collections, createCollection, notify } = useApp();
  const [name, setName] = useState("");
  return (
    <div className="space-y-6">
      <form className="card flex flex-col gap-2 p-4 sm:flex-row" onSubmit={(e) => {
        e.preventDefault();
        if (!name.trim()) return;
        const c = createCollection(name);
        notify(`Created “${c.name}”`);
        setName("");
      }}>
        <label htmlFor="col-name" className="sr-only">Collection name</label>
        <input id="col-name" value={name} onChange={(e) => setName(e.target.value)} maxLength={60}
          placeholder="New collection, e.g. “Tech & security days”"
          className="field field-pill flex-1" />
        <Button type="submit" disabled={!name.trim()}><FolderPlus /> Create collection</Button>
      </form>
      {collections.length === 0 ? (
        <EmptyState icon={FolderOpen} title="No collections yet">
          Create a collection above, then use “Add to collection” on any special day to fill it.
        </EmptyState>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {collections.map((c) => <CollectionCard key={c.id} c={c} />)}
        </div>
      )}
    </div>
  );
}

function CollectionCard({ c }: { c: Collection }) {
  const { today, renameCollection, deleteCollection, toggleInCollection, notify } = useApp();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(c.name);
  const [confirm, setConfirm] = useState(false);
  const occ = useMemo(() => toOccurrences(c.eventIds, today), [c.eventIds, today]);
  return (
    <section className="card p-4" aria-label={c.name}>
      <div className="mb-1 flex items-center gap-2 border-b border-border/60 px-2 pb-3">
        {editing ? (
          <form className="flex flex-1 items-center gap-1" onSubmit={(e) => { e.preventDefault(); renameCollection(c.id, draft); setEditing(false); }}>
            <label htmlFor={`rn-${c.id}`} className="sr-only">Rename collection</label>
            <input id={`rn-${c.id}`} autoFocus value={draft} onChange={(e) => setDraft(e.target.value)} maxLength={60}
              onKeyDown={(e) => e.key === "Escape" && (setEditing(false), setDraft(c.name))}
              className="field field-pill h-9 flex-1 border-primary" />
            <Button type="submit" variant="ghost" size="icon-sm" aria-label="Save name"><Check /></Button>
            <Button variant="ghost" size="icon-sm" aria-label="Cancel" onClick={() => { setEditing(false); setDraft(c.name); }}><X /></Button>
          </form>
        ) : (
          <>
            <h2 className="flex-1 truncate text-base font-bold">{c.name}</h2>
            <span className="text-xs text-muted">{pluralize(c.eventIds.length, "day")}</span>
            <Button variant="ghost" size="icon-sm" aria-label={`Rename ${c.name}`} onClick={() => setEditing(true)}><Pencil /></Button>
            <Button variant="ghost" size="icon-sm" aria-label={`Export ${c.name} as .ics`} disabled={!occ.length}
              onClick={() => { downloadICS(occ, `omnicalendar-${c.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`); notify("Calendar file downloaded"); }}><Download /></Button>
            <Button variant="danger" size="icon-sm" aria-label={`Delete ${c.name}`} onClick={() => setConfirm(true)}><Trash2 /></Button>
          </>
        )}
      </div>
      {occ.length ? (
        <ul>
          {occ.map((o) => (
            <li key={o.event.id} className="flex items-center">
              <div className="min-w-0 flex-1"><EventRow occ={o} /></div>
              <Button variant="ghost" size="icon-sm" aria-label={`Remove ${o.event.name} from ${c.name}`} onClick={() => toggleInCollection(c.id, o.event.id)}><X /></Button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="px-2 py-4 text-sm text-muted">Empty. Open any special day and choose “Add to collection”.</p>
      )}
      <Dialog open={confirm} onClose={() => setConfirm(false)} title={`Delete “${c.name}”?`} description="The special days themselves won't be affected.">
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setConfirm(false)}>Cancel</Button>
          <Button className="bg-danger text-white dark:text-[#2a0a07]" onClick={() => { deleteCollection(c.id); notify(`Deleted “${c.name}”`); }}>Delete</Button>
        </div>
      </Dialog>
    </section>
  );
}
